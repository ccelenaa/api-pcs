import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CronJob, timeout } from 'cron';

@Injectable()
export class FacturationPrestataireService {
  private readonly logger = new Logger(FacturationPrestataireService.name);
  public readonly frequence = this.configService.get('cron.facturation.prestataires');
  public cronJob : CronJob = null;

  constructor(private configService: ConfigService) {
    this.facturationPrestatairesAutomatique();
  }

  private facturationPrestatairesAutomatique() {
    console.log(this.frequence);
    this.cronJob = new CronJob(
      this.frequence,
      () => { this.facturationPrestataires() },
      null,
      true
    );
  }

  public async facturationPrestataires() {
    console.log("Timestamp: ", new Date(), " Next: ", this.cronJob.nextDates(1));
    return { ok: 'yes' }
  }

  public async prochaineFacturationPrestataires() {
    const nextDates = this.cronJob.nextDates(2);
    return {
      now: new Date(),
      next: this.cronJob.nextDate(),
      interval: (nextDates[1] as any) - (nextDates[0] as any),
      rest: timeout(this.frequence)
    };
  }
}