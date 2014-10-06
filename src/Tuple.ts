class Tuple<T>{
  private array: T[];
  constructor(array: T[]){
    this.array = array.slice(0);
  }
  getItem(index: number): T{
    return this.array[index];
  }
  getLength(): number{
    return this.array.length;
  }
}

export = Tuple;
