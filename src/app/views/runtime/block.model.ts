export interface BlockModel {
  blockId: string;
  name: string;
  enabled: number | boolean;
  orderNum: number;
  deleteable: number;
  registerDatetime: Date;
  updateDatetime: Date;
  x: number;
  y: number;
  linkX: number;
  linkY: number;
  loopable: number | boolean;
}

export interface BlockLinkModel {
  blockLinkId?: number;
  blockId: string;
  nextBlockId: string;
  messageText: string;
  action: string;
  label: string;
  webLinkUrl: string;
  enabled: number;
  orderNum: number;
  registerDatetime: Date;
  updateDatetime: Date;
  isMlCategory: number | boolean;
}

export interface BlockImageModel {
  imageId: number;
  name: string;
  title: string;
  orderNum: number;
  githubUrl: string;
  registerDatetime: Date;
  updateDatetime: Date;
}

export interface BlockRuntimeModel {
  blockRuntimeId: number;
  blockId: string;
  imageId: number;
  orderNum: number;
  containerUrl: string;
  containerPort: string;
  containerEnv: string;
  containerState: string;
  containerStateOrigin?: string;
  registerDatetime: Date;
  updateDatetime: Date;
  x: number;
  y: number;
  image: BlockImageModel;
  _ChatImage_github_url: string;
  _ChatImage_imageID: number;
  _ChatImage_name: string;
  _ChatImage_order_num: number;
  _ChatImage_registerDatetime: Date;
  _ChatImage_updateDatetime: Date;
}

export interface RuntimeItemPosModel {
  data?: BlockRuntimeModel | BlockLinkModel[] | BlockModel;
  type: string;
  ref: string;
  x: number;
  y: number;
  w: number;
  h: number;
  orderNum: number;
  msg?: string;
}

export interface ReqBlockModel {
  blockID: string;
  name: string;
  enabled: number;
  order_num: number;
  x: number;
  y: number;
  linkX: number;
  linkY: number;
  loopable: number;
}

export interface ReqBlockRuntimeModel {
  blockRuntimeID?: number;
  blockID: string;
  imageID: number;
  order_num: number;
  container_url: string;
  container_port: string;
  container_env: string;
  x: number;
  y: number;
}

export interface ReqBlockLinkModel {
  blockLinkID?: number;
  blockID: string;
  nextBlockID?: string;
  messageText?: string;
  action: string;
  label: string;
  webLinkUrl?: string;
  enabled: number;
  order_num: number;
  is_ml_category: number;
}

export interface ReqBlockRuntimeStateModel {
  blockRuntimeID: number;
  container_name: string;
  container_state: string;
  image_url: string;
  cpu: string;
  ram: string;
  path: string;
  env: string[];
}

export interface ReqBlockImageModel {
  imageID?: number;
  name: string;
  title: string;
  order_num: number;
  github_url: string;
  registerDatetime?: string;
  updateDatetime?: string;
}
