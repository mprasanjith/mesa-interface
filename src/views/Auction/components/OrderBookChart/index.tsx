/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as d3 from 'd3'
import { utils } from 'ethers'
import React, { useRef, useEffect } from 'react'

// Interfaces
import { Auction, AuctionBid } from 'src/interfaces/Auction'

interface OrderBookChartComponentProps {
  width: number
  height: number
  data: AuctionBid[]
  userAddress: string
  vsp: number
  auction: Auction
}

export interface OrderBookSlice {
      price: number
      sum: number
}

export const OrderBookChart: React.FC<OrderBookChartComponentProps> = ({ width, height, data, userAddress, vsp, auction }) => {
  const ref = useRef<SVGSVGElement>(null)

  const calcBidPricePerShare = (bid: AuctionBid ) => Number(utils.formatEther(bid.tokenIn)) / Number(utils.formatEther(bid.tokenOut))
  
  for(const bid of data){
      bid.price = calcBidPricePerShare(bid)
  }

  const sortedData = data.sort(
      (first, second) => first.price - second.price
  )

  //data.map(item => item.price = calcBidPricePerShare(item))

  const getBidPricePerShare = (bid: AuctionBid ) => Number(utils.formatEther(bid.tokenIn)) / Number(utils.formatEther(bid.tokenOut))

  const getBidPriceText = (bid: AuctionBid, fontSize: number ) => {
    return `${(Number(utils.formatEther(bid.tokenIn)) / Number(utils.formatEther(bid.tokenOut))).toFixed(3)}`
  }

  const getBidPriceTextLong = (bid: AuctionBid, fontSize: number ) => {
    return `${(Number(utils.formatEther(bid.tokenIn)) / Number(utils.formatEther(bid.tokenOut))).toFixed(2)}${
      Number(utils.formatEther(bid.tokenOut)) >= fontSize * 4
        ? ` ${auction.tokenIn?.symbol}/${auction.tokenOut?.symbol} `
        : ''
    }`
  }

  const getBidAmountText = (bid: AuctionBid, fontSize: number) => {
    return `${Number(utils.formatEther(bid.tokenOut)).toFixed(0)}${
      Number(utils.formatEther(bid.tokenOut)) >= fontSize * 3 ? `${auction.tokenOut?.symbol}` : ''
    }`
  }


  const draw = () => {
    if (width <= 232) {
      return
    }
    const svg = d3.select(ref.current)

    const sortedData = data.sort(
      (first, second) => first.price - second.price
    )

    const lowestbid = getBidPricePerShare(sortedData[1])
    const highestbid = getBidPricePerShare(sortedData[sortedData.length-1])

    const diff = highestbid - lowestbid
    const numberOfSlices = 10
    
    const OrderBookSlices: any[] = []

    for (let i = 0; i <= numberOfSlices - 1; i++) {

      const low = lowestbid + (i/numberOfSlices*diff)
      const high = lowestbid + (i+1)/numberOfSlices*diff
      const priceOfSlice = (high + low) / 2

      let sumOfSlice = 0

      const filteredNumbers = sortedData.filter(function (item) {
          if (getBidPricePerShare(item) < high && getBidPricePerShare(item) >= low){
            sumOfSlice = sumOfSlice + Number(utils.formatEther(item.tokenOut))
            return true
          }
      });

      const slice: OrderBookSlice = { price: priceOfSlice, sum: sumOfSlice }
      OrderBookSlices.push(slice)
    }
    OrderBookSlices.reverse()

    svg.selectAll('g').remove()
    const activeOrderBook = svg.append('g').attr('class', 'activeOrderBook').selectAll('rect').data(OrderBookSlices)

    const barHeight = (height - 5) / OrderBookSlices.length
    const activeHeight = OrderBookSlices.length * barHeight + 5

    const xScale = d3
      .scaleLinear()
      .domain([0, 23826])
      .range([0, width - 300])
    //.domain([0, d3.max([...OrderBookSlices])])
        
    let fontSize = (barHeight - 5) * 0.6

    if (fontSize > 15) {
      fontSize = 15
    }
    /*
    activeOrderBook
      .enter()
      .append('rect')
      .attr('y', (i: number) => barHeight * i)
      .attr('height', barHeight - 5)
      .attr('fill', '#4B9E985A')
      .attr('width', (d: number) => xScale(d) + 50)
      .attr('x', (d: number) => 150)
    */
    activeOrderBook
      .enter()
      .append('rect')
      .attr('x', 150)
      .attr('y', (d: number, i: number) =>  barHeight * i + 1)
      .attr('height', barHeight - 5)
      .attr('width', (d: number, i: number) => xScale(OrderBookSlices[i].sum))
      .attr('fill', '#4B9E985A')

    activeOrderBook
      .enter()
      .append('text')
      .attr('fill', '#EE0000')
      .attr('x', 150)
      .attr('y', (d: number, i: number) => barHeight * i - 1 + (barHeight - fontSize) / 2)
      .attr('font-size', (d: number, i: number) => fontSize)
      .attr('dy', '.71em')
      .attr('text-anchor', 'right')
      .text((d: number, i: number) => OrderBookSlices[i].sum.toFixed(3) )

    activeOrderBook
      .enter()
      .append('text')
      .attr('fill', '#EE0000')
      .attr('x', 300)
      .attr('y', (d: number, i: number) => barHeight * i - 1 + (barHeight - fontSize) / 2)
      .attr('font-size', (d: number, i: number) => fontSize)
      .attr('dy', '.71em')
      .attr('text-anchor', 'end')
      .text((d: number, i: number) => OrderBookSlices[i].price.toFixed(3) )

    activeOrderBook
      .enter()
      .append('text')
      .attr('fill', '#EE0000')
      .attr('x', 450)
      .attr('y', (d: number, i: number) => barHeight * i - 1 + (barHeight - fontSize) / 2)
      .attr('font-size', (d: number, i: number) => fontSize)
      .attr('dy', '.71em')
      .attr('text-anchor', 'end')
      .text((d: number, i: number) => lowestbid.toFixed(3) )




    const lineContainer = svg.append('g')
    lineContainer
      .attr('class', 'line')
      .append('rect')
      .attr('y', activeHeight - 6)
      .attr('height', 1)
      .attr('fill', '#304FFE')
      .attr('width', width - 130)
      .attr('x', 130)

    lineContainer
      .append('rect')
      .attr('y', activeHeight - 5.5 - fontSize * 0.9)
      .attr('height', fontSize * 1.8)
      .attr('fill', '#304FFE')
      .attr('width', 90)
      .attr('x', 40)

    lineContainer
      .append('text')
      .attr('y', activeHeight - 5.5 - fontSize * 0.4)
      .attr('fill', '#FFF')
      .attr('x', 85)
      .attr('font-size', fontSize)
      .attr('dy', '.71em')
      .attr('text-anchor', 'middle')
      .text(() => `CP ${vsp.toFixed(2)} ${auction.tokenIn?.symbol}`)

  }

  useEffect(() => {
    const svg = d3
      .select(ref.current)
      .attr('width', width <= 32 ? 0 : width - 32)
      .attr('height', height)
      .style('border', 'none')
  }, [width])

  useEffect(() => {
    draw()
  }, [data, width, vsp])

  return (
    <div className="chart">
      <svg ref={ref}></svg>
    </div>
  )
}

export default OrderBookChart