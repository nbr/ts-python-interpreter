class Dict{
  private object: {};
  constructor(object: {}){
    this.object = object;
  }
  getItem(key: any): any{
    return this.object[key];
  }
  //probably need to tighten up the typing here
  putItem(key: any, value: any): any{
    this.object[key] = value;
  }
}

export = Dict;
