class Dict{
  private object: {};
  private size: number;
  constructor(object: {}){
    this.object = object;
    this.size = 0;
  }
  getItem(key: any): any{
    return this.object[key];
  }
  //probably need to tighten up the typing here
  putItem(key: any, value: any): any{
    if(this.object[key] === undefined){
      this.size++;
    }
    this.object[key] = value;
  }
  getLength(): number{
    return this.size;
  }
}

export = Dict;
