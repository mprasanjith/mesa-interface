// External
import styled from 'styled-components'
import { space, SpaceProps, LayoutProps, ColorProps, BorderProps, MarginProps } from 'styled-system'
import React from 'react'
import numeral from 'numeral'

// Components
import { Flex } from 'src/components/Flex'
import { FormButton } from 'src/components/FormButton'
import { InfoTooltip } from 'src/components/InfoTooltip'

// Svg
import LogoSVG from 'src/assets/svg/Logo.svg'
import DownSVG from 'src/assets/svg/Down-Arrow.svg'
import UpSVG from 'src/assets/svg/Up-Arrow.svg'
import { useWindowSize } from 'src/hooks/useWindowSize'

// Interfaces
import { Sale } from 'src/interfaces/Sale'

// Aqua Utils
import { formatBigInt } from 'src/utils'

// hooks
import { BigNumber } from '@ethersproject/bignumber'
import { useTranslation } from 'react-i18next'

type BarActiveProps = LayoutProps & ColorProps & BorderProps

type BarBallMarker = BarActiveProps & MarginProps

const ControlTitle = styled.div({
  fontStyle: 'normal',
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '17px',
  color: '#000629',
})

const ControlButton = styled.div<SpaceProps>(
  () => ({
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '17px',
    color: '#7B7F93',
  }),
  space
)

const FixedTitle = styled.div({
  fontSize: '16px',
  lineHeight: '19px',
  color: '#000629',
  fontWeight: 500,
})

const FixedDescription = styled.div({
  fontSize: '16px',
  lineHeight: '19px',
  color: '#304FFE',
  fontWeight: 400,
  textAlign: 'right',
  flex: 1,
  display: 'flex',
  justifyContent: 'flex-end',
})

const FixedDescription2 = styled.div({
  color: '#7B7F93',
  margin: '0 5px',
})

const FixedDescription3 = styled.div({
  color: '#000629',
  marginRight: '5px',
})

const BarContainer = styled.div({
  height: '8px',
  borderRadius: '8px',
  backgroundColor: '#DDDDE3',
  display: 'flex',
  margin: '16px 0 8px 0',
  alignItems: 'center',
  position: 'relative',
})

const BarMarker = styled.div<BarBallMarker>(props => ({
  marginLeft: props.marginLeft?.toString() + '%',
  width: '6px',
  height: '6px',
  borderRadius: '6px',
  backgroundColor: 'white',
  position: 'absolute',
}))

const BarActive = styled.div<BarActiveProps>(props => ({
  width: `${props.width}%`,
  height: '8px',
  borderRadius: '8px',
  backgroundColor: '#304FFE',
}))

const LogoImg = styled.img({
  width: '60px',
  height: '18px',
  marginLeft: '4px',
})

const ArrowImg = styled.img({
  width: '16px',
  height: '16px',
  marginLeft: '4px',
})

interface HeaderControlProps {
  status: string
  showGraph: boolean
  isFixed?: boolean
  toggleGraph: () => void
  sale: Sale
}

export function HeaderControl({ status, showGraph, toggleGraph, isFixed, sale }: HeaderControlProps) {
  const [t] = useTranslation()
  const { isMobile } = useWindowSize()

  if ((isFixed && sale.minRaise > BigNumber.from(0)) || status != 'closed') {
    const totalSupply = formatBigInt(sale.sellAmount, sale.tokenOut.decimals)
    const threshold = (formatBigInt(sale.minRaise) * 100) / totalSupply
    const totalAmountPurchased = formatBigInt(sale.soldAmount, sale.tokenOut.decimals)
    const percentageSold = (totalAmountPurchased / totalSupply) * 100

    return (
      <Flex flexDirection="column" flex={1}>
        <Flex flexDirection="row" alignItems="center" justifyContent="flex-start" flex={1}>
          <FixedTitle>{status === 'closed' ? 'Tokens Sold' : 'Sale Progress'}</FixedTitle>
          <FixedDescription>
            {numeral(totalAmountPurchased).format('0.[0000000]')}
            <FixedDescription2>{`(${numeral(percentageSold).format('0.[00]')}%)`}</FixedDescription2>
            <FixedDescription3>
              / {numeral(totalSupply).format('0')} {sale.tokenOut.symbol}
            </FixedDescription3>
            <InfoTooltip>{t('texts.supplyDemandInfo')}</InfoTooltip>
          </FixedDescription>
        </Flex>
        <BarContainer>
          <BarActive width={percentageSold}></BarActive>
          {threshold > 0 ? <BarMarker marginLeft={threshold}></BarMarker> : undefined}
        </BarContainer>
        {threshold > 0 ? (
          <ControlButton ml={`calc( ${(isMobile && threshold > 80 ? 0.55 : 0.85) * threshold}%)`}>
            {`${numeral(threshold).format('0')}% Soft Cap `}
            <InfoTooltip>{t('texts.minThresholdInfo')}</InfoTooltip>
          </ControlButton>
        ) : undefined}
      </Flex>
    )
  }

  if (isMobile && status === 'closed') {
    return (
      <Flex flexDirection="column" justifyContent="space-between" alignItems="center" flex={1}>
        <Flex
          flexDirection="row"
          alignItems="center"
          justifyContent={isMobile && status === 'closed' ? 'center' : 'flex-start'}
          flex={1}
        >
          <ControlTitle>You can get ERT on</ControlTitle>
          <LogoImg data-testid="logo-img" src={LogoSVG} />
        </Flex>
        <FormButton
          disabled={false}
          type="button"
          height="48px"
          fontWeight="500"
          padding="0 50px"
          fontSize="14px"
          lineHeight="21px"
          background="#304FFE"
          color="#fff"
          marginTop="16px"
          width="calc(100%)"
        >
          Go to Swapr
        </FormButton>
      </Flex>
    )
  }

  return (
    <Flex flexDirection="row" justifyContent="space-between" alignItems="center" flex={1}>
      <Flex
        flexDirection="row"
        alignItems="center"
        justifyContent={isMobile && status === 'closed' ? 'center' : 'flex-start'}
        flex={1}
      >
        <ControlTitle>
          {status === 'closed'
            ? 'Missed out on the sale? You can get ERT on'
            : 'How is the Current Price (CP) calculated?'}
        </ControlTitle>
        {status === 'closed' && <LogoImg data-testid="logo-img" src={LogoSVG} />}
      </Flex>
      {status === 'closed' ? (
        <FormButton
          disabled={false}
          type="button"
          height="48px"
          fontWeight="500"
          padding="0 50px"
          fontSize="14px"
          lineHeight="21px"
          background="#304FFE"
          color="#fff"
        >
          Go to Swapr
        </FormButton>
      ) : (
        <Flex
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-start"
          style={{ cursor: 'pointer' }}
          onClick={toggleGraph}
        >
          {!isMobile && <ControlButton>View Live Graph</ControlButton>}
          {status === 'active' && <ArrowImg data-testid="graph-img" src={showGraph ? UpSVG : DownSVG} />}
        </Flex>
      )}
    </Flex>
  )
}

HeaderControl.defaultProps = {
  status: 'active',
  showGraph: false,
  isFixed: false,
  toggleGraph: () => {
    return
  },
}
