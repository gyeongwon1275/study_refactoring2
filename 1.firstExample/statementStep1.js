const usd = (aNumber) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(aNumber / 100)

export default function statement(invoice, plays) {
  // perf => aPerformance
  function amountFor(aPerformance) {
    // thisAmount => result
    let result = 0

    switch (playFor(aPerformance).type) {
      case 'tragedy':
        // 비극
        result = 40000
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30)
        }
        break
      case 'comedy':
        // 희극
        result = 30000
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20)
        }
        result += 300 * aPerformance.audience
        break
      default:
        throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`)
    }
    return result
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID]
  }

  function volumeCreditsFor(aPerformance) {
    let result = 0
    result += Math.max(aPerformance.audience - 30, 0)

    if ('comedy' === playFor(aPerformance).type) {
      result += Math.floor(aPerformance.audience / 5)
    }

    return result
  }

  function totalVolumeCredits() {
    let volumeCredits = 0
    for (let perf of invoice.performances) {
      volumeCredits += volumeCreditsFor(perf)
    }
    return volumeCredits
  }

  /*  

아래의 경우 함수로 분리하자
const format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format 
  
  */

  function totalAmount() {
    let result = 0
    for (let perf of invoice.performances) {
      result += amountFor(perf)
    }
    return result
  }

  let result = `청구내역 (고객명: ${invoice.customer})\n`

  for (let perf of invoice.performances) {
    // 함수 내의 지역변수의 사용은 지양해야 한다.
    // play 는 perf 안에 들어있는 데이터 이므로 굳이 분리해서 인자로 넘길 이유가 없다.
    // const play = plays[perf.playID] => playFor(perf)

    // thisAmount 도 지역변수이므로 제거한다.
    // let thisAmount = amountFor(perf, playFor(perf))

    // 포인트를 적립한다.

    /* 
    
    아래내용을 별도 함수(volumeCreditFor)로 분리
    volumeCredits += Math.max(perf.audience - 30, 0)

    if ('comedy' === play.type) {
      volumeCredits += Math.floor(perf.audience / 5)
    }
    
    */
    result += `${playFor(perf).name} : ${usd(amountFor(perf))} (${
      perf.audience
    }석)\n`

    // 아래의 totalAmount 계산도 별도 반복문으로 분리
    // 성능이 떨어지는 건 맞지만 체감할 정도는 아님
  }

  /* 
  let volumeCredits = 0

  for (let perf of invoice.performances) {
    volumeCredits += volumeCreditFor(perf)
  } */

  result += `총액: ${usd(totalAmount())}\n`
  result += `적립 포인트: ${totalVolumeCredits()}점\n`

  return result
}
