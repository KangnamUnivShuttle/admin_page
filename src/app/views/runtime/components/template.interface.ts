export interface RuntimeItem {

    drag: string;
    orderNum: number;
    x: number;
    y: number;
    w: number;
    h: number;
    id: string;
    lastX: number;
    lastY: number;
    backupX: number;
    backupY: number;

    getStyle(): Object;
    onDragStart(event: any);
    onDrop(event: any);
}