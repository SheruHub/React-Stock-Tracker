
import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import {
	BarSeries,
	AreaSeries,
	CandlestickSeries,
	LineSeries,
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
	CrossHairCursor,
	EdgeIndicator,
	CurrentCoordinate,
	MouseCoordinateX,
	MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import {
	OHLCTooltip,
	MovingAverageTooltip,
} from "react-stockcharts/lib/tooltip";
import { ema, sma } from "react-stockcharts/lib/indicator";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";

class CandleStickChartWithEdge extends React.Component {
	render() {
		const ema5 = ema()
			.id(0)
			.options({ windowSize: 5 })
			.merge((d, c) => {d.ema5 = c;})
			.accessor(d => d.ema5);

		const ema10 = ema()
			.id(2)
			.options({ windowSize: 10 })
			.merge((d, c) => {d.ema10 = c;})
			.accessor(d => d.ema10);

		const smaVolume70 = sma()
			.id(3)
			.options({ windowSize: 10, sourcePath: "volume" })
			.merge((d, c) => {d.smaVolume70 = c;})
			.accessor(d => d.smaVolume70);
		const { type, data: initialData, width, ratio } = this.props;

		const calculatedData = ema5(ema10(smaVolume70(initialData)));
		const xScaleProvider = discontinuousTimeScaleProvider
			.inputDateAccessor(d => d.date);
		const {
			data,
			xScale,
			xAccessor,
			displayXAccessor,
		} = xScaleProvider(calculatedData);

		const start = xAccessor(last(data));
		const end = xAccessor(data[Math.max(0, data.length - 150)]);
		const xExtents = [start, end];

		return (
            <ChartCanvas 
                height={500}
				ratio={ratio}
				width={width}
				margin={{ left: 90, right: 90, top: 70, bottom: 30 }}
				type={type}
				seriesName="MSFT"
				data={data}
				xScale={xScale}
				xAccessor={xAccessor}
				displayXAccessor={displayXAccessor}
				xExtents={xExtents}
			>
				<Chart id={2}
					yExtents={[d => d.volume, smaVolume70.accessor()]}
					height={150} origin={(w, h) => [0, h - 150]}
				>
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={format(".2s")}  stroke="#FFFFFF"  tickStroke="#FFFFFF" />

					<BarSeries yAccessor={d => d.volume} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"} />
					<AreaSeries yAccessor={smaVolume70.accessor()} stroke={smaVolume70.stroke()} fill={smaVolume70.fill()}/>

					<CurrentCoordinate yAccessor={smaVolume70.accessor()} fill={smaVolume70.stroke()} />
					<CurrentCoordinate yAccessor={d => d.volume} fill="#9B0A47" />

					<EdgeIndicator itemType="first" orient="left" edgeAt="left"
						yAccessor={d => d.volume} displayFormat={format(".4s")} fill="#0F0F0F"/>
					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.volume} displayFormat={format(".4s")} fill="#0F0F0F"/>
					<EdgeIndicator itemType="first" orient="left" edgeAt="left"
						yAccessor={smaVolume70.accessor()} displayFormat={format(".4s")} fill={smaVolume70.fill()}/>
					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={smaVolume70.accessor()} displayFormat={format(".4s")} fill={smaVolume70.fill()}/>
				</Chart>
				<Chart id={1}
					yPan yExtents={[d => [d.high, d.low], ema5.accessor(), ema10.accessor()]}
					padding={{ top: 10, bottom: 20 }}
				>

					<XAxis axisAt="bottom" orient="bottom"  stroke="#FFFFFF"  tickStroke="#FFFFFF" />
					<XAxis axisAt="top" orient="top" flexTicks   stroke="#FFFFFF"  tickStroke="#FFFFFF" />
					<YAxis axisAt="right" orient="right" ticks={5}   stroke="#FFFFFF"  tickStroke="#FFFFFF" />

					<CandlestickSeries />

					<LineSeries yAccessor={ema5.accessor()} stroke={ema5.stroke()} highlightOnHover />
					<LineSeries yAccessor={ema10.accessor()} stroke={ema10.stroke()} highlightOnHover />

					<CurrentCoordinate yAccessor={ema5.accessor()} fill={ema5.stroke()} />
					<CurrentCoordinate yAccessor={ema10.accessor()} fill={ema10.stroke()} />

					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={ema5.accessor()} fill={ema5.fill()}/>
					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={ema10.accessor()} fill={ema10.fill()}/>
					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}/>
					<EdgeIndicator itemType="first" orient="left" edgeAt="left"
						yAccessor={ema5.accessor()} fill={ema5.fill()}/>
					<EdgeIndicator itemType="first" orient="left" edgeAt="left"
						yAccessor={ema10.accessor()} fill={ema10.fill()}/>
					<EdgeIndicator itemType="first" orient="left" edgeAt="left"
						yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}/>

					<MouseCoordinateX
						at="top"
						orient="top"
						displayFormat={timeFormat("%Y-%m-%d")} />
					<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%Y-%m-%d")} />
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />
					<MouseCoordinateY
						at="left"
						orient="left"
						displayFormat={format(".2f")} />

					<OHLCTooltip origin={[-40, -65]}/>
					<MovingAverageTooltip
						onClick={e => console.log(e)}
						origin={[-38, 15]}
						options={[
							{
								yAccessor: ema5.accessor(),
								type: ema5.type(),
								stroke: ema5.stroke(),
								windowSize: ema5.options().windowSize,
							},
							{
								yAccessor: ema10.accessor(),
								type: ema10.type(),
								stroke: ema10.stroke(),
								windowSize: ema10.options().windowSize,
							},
						]}
					/>
				</Chart>
				<CrossHairCursor />
			</ChartCanvas>
		);
	}
}

/*


*/

CandleStickChartWithEdge.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChartWithEdge.defaultProps = {
	type: "svg",
};
CandleStickChartWithEdge = fitWidth(CandleStickChartWithEdge);

export default CandleStickChartWithEdge;
