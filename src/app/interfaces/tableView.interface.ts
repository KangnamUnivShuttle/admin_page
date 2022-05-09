export interface TableViewDataModel {
  [key: string]: {
    url: string;
    dataMap: { [key: string]: string };
  };
}

export interface TableViewHeaderModel {
  col: string;
  val: any;
}
