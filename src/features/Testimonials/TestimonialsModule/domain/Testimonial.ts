export type TestimonialProps = {
  image_url: string;
  image_url_64?: string | null;
  image_url_256?: string | null;
  image_url_512?: string | null;
  company_logo_url?: string | null;
  company_logo_url_64?: string | null;
  company_logo_url_256?: string | null;
  company_logo_url_512?: string | null;
  name: string;
  role: string | null;
  company: string | null;
  body: string;

  // metadata
  id: string;
  rankingIndex: number;
};

export type TestimonialCreateDTO = Omit<
  TestimonialProps,
  | "id"
  | "rankingIndex"
  | "image_url"
  | "image_url_64"
  | "image_url_256"
  | "image_url_512"
  | "company_logo_url"
  | "company_logo_url_64"
  | "company_logo_url_256"
  | "company_logo_url_512"
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

  static create(
    image_url: string,
    props: TestimonialCreateDTO,
    imageUrls?: { url64?: string; url256?: string; url512?: string },
    companyLogoUrls?: {
      url: string;
      url64?: string;
      url256?: string;
      url512?: string;
    },
  ) {
    return new Testimonial({
      ...props,
      id: crypto.randomUUID(),
      rankingIndex: Date.now(),
      image_url,
      image_url_64: imageUrls?.url64 || null,
      image_url_256: imageUrls?.url256 || null,
      image_url_512: imageUrls?.url512 || null,
      company_logo_url: companyLogoUrls?.url || null,
      company_logo_url_64: companyLogoUrls?.url64 || null,
      company_logo_url_256: companyLogoUrls?.url256 || null,
      company_logo_url_512: companyLogoUrls?.url512 || null,
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

  setImageUrls(urls: {
    url: string;
    url64?: string;
    url256?: string;
    url512?: string;
  }) {
    this._props.image_url = urls.url;
    this._props.image_url_64 = urls.url64 || null;
    this._props.image_url_256 = urls.url256 || null;
    this._props.image_url_512 = urls.url512 || null;
  }

  setCompanyLogoUrls(urls: {
    url: string | null;
    url64?: string | null;
    url256?: string | null;
    url512?: string | null;
  }) {
    this._props.company_logo_url = urls.url;
    this._props.company_logo_url_64 = urls.url64 || null;
    this._props.company_logo_url_256 = urls.url256 || null;
    this._props.company_logo_url_512 = urls.url512 || null;
  }

  setRankingIndex(rankingIndex: number) {
    this._props.rankingIndex = rankingIndex;
  }
}
