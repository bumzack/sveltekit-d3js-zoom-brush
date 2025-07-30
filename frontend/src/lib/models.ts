import type { ScaleLinear, ScaleTime } from 'd3-scale';
import type { Line } from 'd3-shape';

export interface MultilineChartRequest {
	ids: number[];
}

export interface PointData {
	x: Date;
	y: number;
}

export interface LineData {
	points: PointData[];
	legend: string;
	color: string;
	id: number;
}

export interface MultilineChart {
	minX: Date;
	maxX: Date;
	minY: number;
	maxY: number;
	lineData: LineData[];
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
	xScale: ScaleTime<number, number> | null;
	yScale: ScaleLinear<number, number> | null;
	lineGenerator: Line<PointData> | null;
}
