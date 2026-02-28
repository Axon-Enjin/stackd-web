export type MemberProps = {
  image_url: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  role: string;
  bio: string;

  // metadata
  id: string;
  rankingIndex: number;
};

export type MemberCreateDTO = Omit<
  MemberProps,
  "id" | "rankingIndex" | "image_url"
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

  static create(image_url: string, props: MemberCreateDTO) {
    return new Member({
      ...props,
      id: crypto.randomUUID(),
      rankingIndex: Date.now(), // always returns a number higher than the last time you call it
      image_url,
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

  setRankingIndex(rankingIndex: number) {
    this._props.rankingIndex = rankingIndex;
  }
}
