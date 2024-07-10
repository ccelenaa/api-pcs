import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import * as amqplib from 'amqplib';
import { EventEmitter } from 'events';
  // const logger = require('@core/grayan')('rabbitmq');
  // import * as Ajv from 'ajv';

@Injectable()
export class RabbitMQService {

  public events: EventEmitter = new EventEmitter();
  public enabled = true;
  public connecting = false;
  public connection: amqplib.Connection = null;
  public channel: amqplib.Channel = null;

  private DEFAULT_CONNECTION_TIMEOUT = 5000;
  private DEFAULT_RETRY_DELAY = 2500;

  constructor(private configService: ConfigService, private prisma: PrismaService, private httpService: HttpService) {
    // this.configService.getOrThrow(this.CONFIG_KEY);

    // this.connect();
  }

  async connect() {
    if (this.enabled && this.connecting === false) {
      this.connecting = true;

      console.log('Connecting');

      const { connection: options, topology = null, retry: delay = this.DEFAULT_RETRY_DELAY }: any = this.configService.get('rabbitmq');

      try {
        if (this.connection === null) {
          console.log('Opening connection');

          this.connection = await amqplib.connect(options);

          this.connection.on('close', (error) => {
            if (error) {
              console.log(error, 'Connection error');
            }

            console.log('Connection closed');

            this.connection = null;

            this.connect();
          });
        }

        if (this.channel === null) {
          console.log('Opening channel');

          this.channel = await this.connection.createChannel();

          this.channel.on('error', (error) => {
            console.log(error, 'Channel error');
          });

          this.channel.on('close', () => {
            console.log('Channel closed');

            this.channel = null;

            this.connect();
          });
        }

        if (topology !== null) {
          await this.createTopology(this.channel, topology);
        }

        console.log('Connected');

        this.events.emit('connected');
      } catch (error) {
        console.log(error, 'Connection failed');

        setTimeout(() => {
          this.connect();
        }, delay);
      } finally {
        this.connecting = false;
      }
    }
  }

  /**
   * @typedef {Object} Binding
   * @property {string} [queue]    - Queue name
   * @property {string} [exchange] - Exchange name
   * @property {string} [key]      - Routing key
   *
   * @typedef {Object} Exchange
   * @property {string}    type       - Exchange type (fanout, direct, topic, headers)
   * @property {boolean}   [internal] - If true, exchange is declared internal
   * @property {Binding[]} [bind]     - List of queue to bind on this exchange (queue and key)
   *
   * @typedef {Object} Queue
   * @property {number}    [ttl]          - Messages TTL
   * @property {Object}    [dlx]          - Queue dead letter exchange
   * @property {string}    [dlx.exchange] - DLX name
   * @property {string}    [dlx.key]      - Routing key used to publish message in the DLX
   * @property {Binding[]} [bind]         - List of queue to bind on this exchange (exchange and key)
   */

  // const ajv = new Ajv();



  async createTopology(channel: amqplib.Channel, topology) {
    const { exchanges = {}, queues = {}, bindings = [] } = topology;

    for (const [name, exchange] of Object.entries(exchanges)) {
      const { type, internal = false, bind = [] }: any = exchange;
      await channel.assertExchange(name, type, { internal });

      bindings.push(...bind.map((binding) => ({ ...binding, exchange: name })));
    }

    for (const [name, queue] of Object.entries(queues)) {
      const { ttl, dlx = {}, bind = [], ...options }: any = queue;
      const { exchange, key } = dlx;

      await channel.assertQueue(name, {
        deadLetterExchange: exchange,
        deadLetterRoutingKey: key,
        messageTtl: ttl,
        ...options
      });

      bindings.push(...bind.map((binding) => ({ ...binding, queue: name })));
    }

    for (const { queue, exchange, key } of bindings) {
      await channel.bindQueue(queue, exchange, key);
    }
  };

  /**
   * Return channel
   *
   * @returns {Promise} A promise resolved when the channel is created
   */
  getChannel(): Promise<amqplib.Channel> {
    if (this.channel !== null) {
      return Promise.resolve(this.channel);
    }

    return new Promise((resolve, reject) => {
      const { timeout = this.DEFAULT_CONNECTION_TIMEOUT }: any = this.configService.get('rabbitmq');

      const timer = setTimeout(() => {
        this.events.removeListener('connected', cb);

        return reject(new Error('Connection timeout'));
      }, timeout);

      const cb = () => {
        clearTimeout(timer);

        return resolve(this.channel);
      };

      this.events.once('connected', cb);
    });
  };

  getBuffer(msg) {
    if (Buffer.isBuffer(msg)) {
      return msg;
    }

    if (typeof msg === 'string') {
      return Buffer.from(msg, 'utf8');
    }

    if (typeof msg === 'object' && msg !== null) {
      return Buffer.from(JSON.stringify(msg), 'utf8');
    }

    throw new TypeError('The message should be a buffer, a string or a non-null object');
  };


  /**
   * Check connection status
   *
   * @returns {boolean} True when the connection is opened, false otherwise
   */
  isConnected() {
    return this.connection !== null && this.channel !== null;
  };

  /**
   * Subscribe to a queue
   *
   * Received messages are validated against the JSON schema.
   * Invalid messages are ignored (acked).
   * The message is acked if the handler is resolved, nacked otherwise.
   *
   * @param   {Object}   options         - Subscription options
   * @param   {string}   options.queue   - Name of the queue to subscribe to
   * @param   {number}   [options.retry] - Delay to retry failed messages
   * @param   {Object}   schema          - JSON schema to validate received messages
   * @param   {Function} handler         - Handler called with message content (must return a Promise)
   * @returns {Promise}  A Promise resolved when subscription is completed
   */
  async subscribe({ queue, retry }, schema, handler) {
    // const validate = ajv.compile(schema);
    const channel = await this.getChannel();

    if (typeof retry === 'number' && retry > 0) {
      const exchange = `${queue}.dlx`;

      await this.createTopology(channel, {
        exchanges: {
          [exchange]: { type: 'direct' }
        },
        queues: {
          [queue]: {
            dlx: { exchange, key: 'wait' },
            bind: [{ exchange, key: 'retry' }],
            arguments: {
              'x-queue-type': 'quorum',
              'x-quorum-initial-group-size': 5,
              'x-quorum-member-lease-count': 5,
            // 'x-single-active-consumer': true
            } 
          },
          [`${queue}.retry`]: {
            dlx: { exchange, key: 'retry' },
            bind: [{ exchange, key: 'wait' }],
            arguments: {
              'x-queue-type': 'quorum',
              'x-quorum-initial-group-size': 5,
              'x-quorum-member-lease-count': 5,
              // 'x-single-active-consumer': true
            }
            ,
            ttl: retry
          }
        }
      });
    } else {
      await this.channel.assertQueue(queue);
    }

    let consumerTag = `api-bleme-${Math.random()}`;
    try { consumerTag = this.configService.get('HOSTNAME'); } catch (err) {}

    await this.channel.consume(queue, (msg) => {
      if (msg === null) {
        return null;
      }

      try {
        const content = JSON.parse(msg.content.toString());

        // if (!validate(content)) {
        //   throw new Error(`Invalid message: ${ajv.errorsText(validate.errors)}`);
        // }

        return handler(content).then(() => {
          this.channel.ack(msg);
        }).catch((error) => {
          this.events.emit('error', error);

          this.channel.nack(msg, false, false);
        });
      } catch (error) {
        this.events.emit('error', error);

        return this.channel.ack(msg);
      }
    }, {consumerTag});
  }


  /**
   * Create RabbitMQ entities
   *
   * @param   {Object}                    topology             - List of entities to create on the RabbitMQ broker
   * @param   {Object.<string, Exchange>} [topology.exchanges] - List of exchanges
   * @param   {Object.<string, Queue>}    [topology.queues]    - List of queues
   * @param   {Binding[]}                 [topology.bindings]  - List of bindings
   * @returns {Promise}                   A promise resolved when all entities have been created
   */
  async configure(topology) {
    const channel = await this.getChannel();

    return this.createTopology(channel, topology);
  }

  /**
   * Publish a message
   *
   * @param   {string}               exchange   - Exchange name
   * @param   {string}               routingKey - Routing key used to publish message
   * @param   {string|object|Buffer} msg        - Message to publish
   * @param   {object}               [options]  - Publish options
   * @returns {Promise}              A Promise resolved when the message is published
   */
  async publish(exchange, routingKey, msg, options = {}) {
    const channel = await this.getChannel();

    await channel.publish(exchange, routingKey, this.getBuffer(msg), options);
  }


  /**
   * Close the connection to the RabbitMQ broker
   *
   * @returns {Promise} A Promise resolved when the connection is closed
   */
  async close() {
    this.enabled = false;

    if (this.channel !== null) {
      await this.channel.close();
    }

    if (this.connection !== null) {
      await this.connection.close();
    }
  }

}
