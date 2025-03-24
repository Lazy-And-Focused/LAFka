import { Types } from "./types"; 
import { Rights } from "lafka/types";

export class LazyRightsService<
  T extends Rights.RightsKeys,
  K extends T extends "default"
    ? keyof Rights.LazyRights
    : string = T extends "default"
      ? keyof Rights.LazyRights
      : string
> extends Types.LazyRightsService<T, K> {
  public constructor(public readonly rights: Rights.Rights[T]) {
    super(rights);
  }
  
  public has<R extends Types.RightsTypeArray<T, K> = Types.RightsTypeArray<T, K>>(data: {
    key: K extends keyof Rights.LazyRights ? K : string,
    rights: R
  }) {
    const rights = Array.from(new Set(data.rights));

    if (rights.length === 0) return false;

    const existingRights = (this.rights as any)[data.key];

    return Object.fromEntries(rights.map((right) => {
      return existingRights[right] === 0
        ? [right, false]
        : [right, true];
    })) as Record<R[number], boolean>;
  }
};

class RightsService<
  T extends Rights.RightsKeys,
  K extends T extends "default"
    ? keyof Rights.LazyRights
    : string = T extends "default"
      ? keyof Rights.LazyRights
      : string
> {
  public constructor(public readonly rights: Rights.Rights[T]) {};

  public hasOne(data: {
    key: K extends keyof Rights.LazyRights ? K : string;
    right: bigint|number;
  }) {
    const right = BigInt(data.right);
    const raw = Rights.Parser.execute((this.rights as any)[data.key]);
    
    return (raw & right) === right;
  }

  public has(
    data: {
      key: K extends keyof Rights.LazyRights ? K : string;
      rights: [...[bigint|number]];
    }
  ) {
    for (const right of data.rights) {
      if (!this.hasOne({...data, right})) return false;
      else continue;
    }

    return true;
  }
}

const b = new RightsService<"posts">({"12345": Rights.DEFAULT_USER_RIGHTS.POSTS}).has({
  key: "12345",
  rights: [
    Rights.DEFAULT_USER_RIGHTS.ME.ADMINISTRATOR
  ]
})




const d = new LazyRightsService<"default">(Rights.DEFAULT_USER_RIGHTS).has({
  key: "ME",
  rights: ["ADMINISTRATOR"]
});

console.log(d);

const u = new LazyRightsService<"users">({"12345": Rights.DEFAULT_USER_RIGHTS.USERS}).has({
  key: "12345",
  rights: ["MANAGE"]
});

console.log(u);

export default RightsService;
