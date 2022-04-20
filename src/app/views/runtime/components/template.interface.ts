export interface RuntimeItem {

    drag: string;
    x: number;
    y: number;
    id: string;
    lastX: number;
    lastY: number;

    getStyle(): Object;
    onDragStart(event: any);
    onDrop(event: any);
}