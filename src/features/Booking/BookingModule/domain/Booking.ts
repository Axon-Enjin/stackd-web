export class Booking {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly startTime: Date,
    public readonly endTime: Date,
    public readonly meetLink?: string,
    public readonly eventId?: string,
  ) {}
}
