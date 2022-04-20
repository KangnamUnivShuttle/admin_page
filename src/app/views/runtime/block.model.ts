export interface BlockModel {
    blockId: string;
    name: string;
    enabled: number;
    orderNum: number;
    deleteable: number;
    registerDatetime: Date;
    updateDatetime: Date;
}

export interface BlockLinkModel {
    blockLinkId: number;
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
}

export interface BlockImageModel {
    imageId: number;
    name: string;
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
    image: BlockImageModel;
}

export interface BlockImageModel  {
    imageId: number;
    name: string;
    orderNum: number;
    githubUrl: string;
    registerDatetime: Date;
    updateDatetime: Date;
}

export interface RuntimeItemPosModel {
    data?: BlockRuntimeModel;
    type: string;
    ref: string;
    x: number;
    y: number;
    w: number;
    h: number;
    orderNum: number;
    msg?: string;
}