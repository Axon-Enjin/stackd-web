import { z } from "zod";

const EmailSchema = z.object({
  receiverEmail: z.string().email(),
  content: z.string().min(1),
  subject: z.string().optional(),
});

type EmailProps = z.infer<typeof EmailSchema>;

export class Email {
  private _props: EmailProps;

  private constructor(props: EmailProps) {
    this._props = props;
  }

  get receiverEmail() { return this._props.receiverEmail; }
  get content() { return this._props.content; }
  get subject() { return this._props.subject || "No Subject"; }

  static create(props: EmailProps): Email {
    const result = EmailSchema.parse(props);
    return new Email(result);
  }

  static hydrate(props: EmailProps): Email {
    return new Email(props);
  }

  update(props: Partial<EmailProps>) {
    const updated = { ...this._props, ...props };
    this._props = EmailSchema.parse(updated);
  }

  get props() {
    return Object.freeze({ ...this._props });
  }
}
