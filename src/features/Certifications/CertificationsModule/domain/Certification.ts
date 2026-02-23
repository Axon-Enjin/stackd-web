export type CertificationProps = {
  image_url: string;
  title: string;
  description: string;

  // metadata
  id: string;
  rankingIndex: number;
};

export type CertificationCreateDTO = Omit<
  CertificationProps,
  "id" | "rankingIndex" | "image_url"
>;

export type CertificationUpdateDTO = Partial<CertificationCreateDTO>;

export class Certification {
  private _props: CertificationProps;
  private constructor(props: CertificationProps) {
    this._props = props;
  }

  get props() {
    return this._props;
  }

  static hydrate(props: CertificationProps) {
    return new Certification(props);
  }

  static create(image_url: string, props: CertificationCreateDTO) {
    return new Certification({
      ...props,
      id: crypto.randomUUID(),
      rankingIndex: Date.now(), // always returns a number higher than the last time you call it
      image_url,
    });
  }

  update(props: CertificationUpdateDTO) {
    this._props = {
      ...this._props,
      ...props,
    };
  }

  setImageUrl(imageUrl: string) {
    this._props.image_url = imageUrl;
  }
}
