export interface MultilineChartRequest {
	ids: Array<number>;
}

export interface PointData {
	x: Date;
	y: number;
}

export interface LineData {
	points: Array<PointData>;
	legend: string;
	color: string;
}

export interface MultilineChart {
	minX: Date;
	maxX: Date;
	minY: number;
	maxY: number;
	lineData: Array<LineData>;
}

export interface ChartMargins {
	top: number;
	right: number;
	bottom: number;
	left: number;
}

export interface ToolTipData {
	txt: string;
	x: number;
	y: number;
}

export interface ChartParameter {
	full: boolean;
	height: number;
	margin: ChartMargins;
	xScale: any;
	yScale: any;
	lineGenerator: any;
}
