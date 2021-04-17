/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as d3 from 'd3'
import { utils } from 'ethers'
import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'

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
      low: number
      high: number
      sum: number
      avg: number
      bids: number
      weightedprice: number
}

const activeOrderBook = styled.svg({
  fontStyle: 'normal',
  fontWeight: 600,
  fontSize: '36px',
  lineHeight: '44px',
})


export const OrderBookChart: React.FC<OrderBookChartComponentProps> = ({ width, height, data, userAddress, vsp, auction }) => {
  const ref = useRef<SVGSVGElement>(null)

  const getBidPricePerShare = (bid: AuctionBid ) => Number(utils.formatEther(bid.tokenIn)) / Number(utils.formatEther(bid.tokenOut))

  
  const setPrice = (bid: AuctionBid) => {
      bid.price = getBidPricePerShare(bid)
  }
 
  for(const bid of data){
      setPrice(bid)
  }


  /*
  const sortedData = data.sort(
      (first, second) => first.price - second.price
  )
  */
  //data.map(item => item.price = calcBidPricePerShare(item))


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
  
  const getWeightedPriceText = (slice: OrderBookSlice) => {
      if (slice.bids > 0) {
        return `${slice.weightedprice.toFixed(2)}`
      } else {
        return ''
      }
  }

  const getTokenSumText = (slice: OrderBookSlice) => {
      if (slice.bids > 0) {
        return `${slice.sum.toFixed(0)} ${auction.tokenOut?.symbol}`
      } else {
        return ''
      }
  }

  const getBidNumberAndAvgText = (slice: OrderBookSlice) => {
      if (slice.bids > 0) {
        return `${slice.bids} bids / avarage ${slice.avg.toFixed(0)}`
      } else {
        return ''
      }
  }

  const getAddionalInfo = (slice: OrderBookSlice) => {
      if (slice.bids > 0) {
        return `
        high: ${slice.high}
        price: ${slice.price}
        weightedprice: ${slice.weightedprice}
        low: ${slice.low}
        sum: ${slice.sum}
        number of bids: ${slice.bids}
        avarage bid size: ${slice.avg}`
      } else {
        return ''
      }
  }

  const sortedData = data.sort(
    (first, second) => getBidPricePerShare(first) - getBidPricePerShare(second)
  )

  // Todo: show only 95%, cut off the top/low, to prevent somebody to set a very high bid and destroy the chart
  const draw = () => {
    if (width <= 232) {
      return
    }
    const svg = d3.select(ref.current)

    const numberOfSlices = 20

    // if(data[0].price) {
    //     const lowestbid = data[0].price
    // } else {
    //     const lowestbid = getBidPricePerShare(sortedData[0])      
    // }
    // const lowestbid = data[0].price!
    const lowestbid = getBidPricePerShare(sortedData[1])

    // getBidPricePerShare(sortedData[1])

    //const highestbid = getBidPricePerShare(sortedData[sortedData.length-1])
    
    const highestbid = 3

    const fullRange = highestbid - lowestbid  
    const OrderBookSlices: any[] = []


    let highestSumOfTokenOutinSlice = 0

    // loop is from  lowest to highest range

    for (let i = 0; i < numberOfSlices; i++) {

      const sliceRange = fullRange / numberOfSlices
      
      const low = lowestbid + i * sliceRange
      let high = low + sliceRange

      const priceOfSlice = (high + low) / 2
      let weightedPriceOfSlice = 0
      let sumOfTokenOutinSlice = 0
      let sumOfTokenIninSlice = 0

      let sumOfBids = 0

      // a dirty trick to have the highest single bid also in the range
      // in fact getBidPricePerShare(item) <= high would be need in filteredNumbers on tha top bid
      // but this is just the most simpel way
      if (i + 1 == numberOfSlices){
         high = high + sliceRange
      } 

      const filteredNumbers = sortedData.filter(function (item) {
          const price = getBidPricePerShare(item)
          const tokenIn = Number(utils.formatEther(item.tokenIn))
          const tokenOut = Number(utils.formatEther(item.tokenOut))

          if (price >= low && price < high){
            sumOfTokenIninSlice = sumOfTokenIninSlice + tokenIn
            sumOfTokenOutinSlice = sumOfTokenOutinSlice + tokenOut
            sumOfBids = sumOfBids + 1
            return true
          }
      });

      weightedPriceOfSlice = sumOfTokenIninSlice /  sumOfTokenOutinSlice

      if (highestSumOfTokenOutinSlice < sumOfTokenOutinSlice){
          highestSumOfTokenOutinSlice = sumOfTokenOutinSlice
      }

      const slice: OrderBookSlice = { 
          price: priceOfSlice,
          high: high,
          low: low,
          sum: sumOfTokenOutinSlice, 
          bids: sumOfBids, 
          avg: sumOfTokenOutinSlice/sumOfBids, 
          weightedprice: weightedPriceOfSlice
        }
      OrderBookSlices.push(slice)
    }
    //OrderBookSlices.reverse()

    svg.selectAll('g').remove()
    const activeOrderBook = svg.append('g').attr('class', 'activeOrderBook').selectAll('rect').data(OrderBookSlices)

    const barHeight = (height - 5) / OrderBookSlices.length
    const activeHeight = OrderBookSlices.length * barHeight + 5

    const xScale = d3
      .scaleLinear()
      .domain([0, highestSumOfTokenOutinSlice])
      .range([0, width - 100])

    const yScale = d3
      .scaleLinear()
      .domain([lowestbid, highestbid])
      .range([1, height-2])

    //.domain([0, d3.max([...OrderBookSlices])])
        
    let fontSize = (barHeight - 5) * 0.6

    if (fontSize > 15) {
      fontSize = 15
    }
    fontSize = 12
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

    activeOrderBook.style('font-family', 'monospace') 
    activeOrderBook
      .enter()
      .append('rect')
      .attr('x', 50)
      //.attr('y', (d: number, i: number) =>  (barHeight * i + 1).toFixed(0) )
      .attr('y', (d: number, i: number) =>  yScale( OrderBookSlices[i].low ) )
      .attr('height', (barHeight - 5).toFixed(0) )
      .attr('width', (d: number, i: number) => xScale(OrderBookSlices[i].sum).toFixed(0))
      .attr('fill', '#4B9E985A')
      .append('text')


    activeOrderBook
      .enter()
      .append('rect')
      .attr('x', 100)
      .attr('x', 100)
      .attr('height', 10 )
      .attr('width',  10 )
      .attr('fill', '#4B9E985A')

  // weightedprice 
    activeOrderBook
      .enter()
      .append('text')
      .attr('fill', '#EE0000')
      .attr('x', 10)
      //.attr('y', (d: number, i: number) => (barHeight * i - 1 + (barHeight - fontSize) / 2).toFixed(0)  )
      .attr('y', (d: number, i: number) =>  yScale( OrderBookSlices[i].price ) )
      .attr('font-size', (d: number, i: number) => fontSize)
      //.attr('dy', '-.5em')
      .attr('text-anchor', 'left')
      .text((d: number, i: number) => getWeightedPriceText(OrderBookSlices[i]) )

    // weightedprice mark
  activeOrderBook
      .enter()
      .append('rect')
      .attr('fill', '#000000')
      .attr('x', 40)
      .attr('y', (d: number, i: number) => yScale(OrderBookSlices[i].weightedprice) )
      .attr('height', 1)
      .attr('width', 10)

    activeOrderBook
      .enter()
      .append('text')
      .attr('fill', '#EE0000')
      .attr('x', 300)
      //.attr('y', (d: number, i: number) => (barHeight * i - 1 + (barHeight - fontSize) / 2).toFixed(0) )
      .attr('y', (d: number, i: number) =>  yScale( OrderBookSlices[i].low ) )
      .attr('font-size', (d: number, i: number) => fontSize)
      .attr('dy', '.71em')
      .attr('text-anchor', 'end')
      .text((d: number, i: number) => getTokenSumText(OrderBookSlices[i]) )

    activeOrderBook
      .enter()
      .append('text')
      .attr('fill', '#EE0000')
      .attr('x', 450)
      //.attr('y', (d: number, i: number) => (barHeight * i - 1 + (barHeight - fontSize) / 2).toFixed(0) )
      .attr('y', (d: number, i: number) =>  yScale( OrderBookSlices[i].low ) )
      .attr('font-size', (d: number, i: number) => fontSize)
      .attr('dy', '.71em')
      .attr('text-anchor', 'end')
      .text((d: number, i: number) =>  getBidNumberAndAvgText(OrderBookSlices[i]) )
      .append('svg:title')
      .text((d, i) => getAddionalInfo(OrderBookSlices[i]))

    /*  
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
    */
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