export type MemberProps = {
  image_url: string;
  image_url_64?: string | null;
  image_url_256?: string | null;
  image_url_512?: string | null;
  firstName: string;
  middleName?: string;
  lastName: string;
  role: string;
  bio: string;

  linkedinProfile?: string,

  achievements: string[]

  // metadata
  id: string;
  rankingIndex: number;
};

export type MemberCreateDTO = Omit<
  MemberProps,
  "id" | "rankingIndex" | "image_url" | "image_url_64" | "image_url_256" | "image_url_512"
>;

export type MemberUpdateDTO = Partial<MemberCreateDTO>;

export class Member {
  private _props: MemberProps;
  private constructor(props: MemberProps) {
    this._props = props;
  }

  get props() {
    return this._props;
  }

  static hydrate(props: MemberProps) {
    return new Member(props);
  }

  static create(image_url: string, props: MemberCreateDTO, imageUrls?: { url64?: string; url256?: string; url512?: string }) {
    return new Member({
      ...props,
      id: crypto.randomUUID(),
      rankingIndex: Date.now(), // always returns a number higher than the last time you call it
      image_url,
      image_url_64: imageUrls?.url64 || null,
      image_url_256: imageUrls?.url256 || null,
      image_url_512: imageUrls?.url512 || null,
    });
  }

  update(props: MemberUpdateDTO) {
    this._props = {
      ...this._props,
      ...props,
    };
  }

  setImageUrl(imageUrl: string) {
    this._props.image_url = imageUrl;
  }

  setImageUrls(urls: { url: string; url64?: string; url256?: string; url512?: string }) {
    this._props.image_url = urls.url;
    this._props.image_url_64 = urls.url64 || null;
    this._props.image_url_256 = urls.url256 || null;
    this._props.image_url_512 = urls.url512 || null;
  }

  setRankingIndex(rankingIndex: number) {
    this._props.rankingIndex = rankingIndex;
  }
}
