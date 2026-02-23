export type TestimonialProps = {
  image_url: string;
  title: string;
  description: string;
  body: string;

  // metadata
  id: string;
  rankingIndex: number;
};

export type TestimonialCreateDTO = Omit<
  TestimonialProps,
  "id" | "rankingIndex" | "image_url"
>;

export type TestimonialUpdateDTO = Partial<TestimonialCreateDTO>;

export class Testimonial {
  private _props: TestimonialProps;
  private constructor(props: TestimonialProps) {
    this._props = props;
  }

  get props() {
    return this._props;
  }

  static hydrate(props: TestimonialProps) {
    return new Testimonial(props);
  }

  static create(image_url: string, props: TestimonialCreateDTO) {
    return new Testimonial({
      ...props,
      id: crypto.randomUUID(),
      rankingIndex: Date.now(), // always returns a number higher than the last time you call it
      image_url,
    });
  }

  update(props: TestimonialUpdateDTO) {
    this._props = {
      ...this._props,
      ...props,
    };
  }

  setImageUrl(imageUrl: string) {
    this._props.image_url = imageUrl;
  }
}
