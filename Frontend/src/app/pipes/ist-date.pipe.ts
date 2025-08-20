import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'istDate',
})
export class IstDatePipe implements PipeTransform {
  transform(
    value: string | Date,
    format: string = 'dd MMMM yyyy, h:mm a'
  ): string {
    const utcDate = new Date(value);
    const istOffsetMs = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(utcDate.getTime() + istOffsetMs);
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(istDate);
  }
}
