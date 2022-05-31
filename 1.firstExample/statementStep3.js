export function statement(invoice, plays) {
  return renderPlainText(createStatementData(invoice, plays))
}

const usd = (aNumber) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(aNumber / 100)

class PerformanceCalculator {
  constructor(aPerformance, aPlay) {
    this.performance = aPerformance
    this.play = aPlay
  }

  get amount() {
    throw new Error(`서브 클래스에서 처리`)
  }

  get volumeCredits() {
    return Math.max(this.performance.audience - 30, 0)
  }
}

class TragedyCalculator extends PerformanceCalculator {
  constructor(aPerformance, aPlay) {
    super(aPerformance, aPlay)
  }

  get amount() {
    let result = 40000
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30)
    }
    return result
  }
}

class ComedyCalculator extends PerformanceCalculator {
  constructor(aPerformance, aPlay) {
    super(aPerformance, aPlay)
  }

  get amount() {
    let result = 30000
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20)
    }
    result += 300 * this.performance.audience
    return result
  }

  get volumeCredits() {
    return super.volumeCredits + Math.floor(this.performance.audience / 5)
  }
}

function createStatementData(invoice, plays) {
  /* 중간 데이터 생성을 전담 */

  const result = {}

  result.customer = invoice.customer
  result.performances = invoice.performances.map(enrichPerformance)
  result.totalAmount = totalAmount(result)
  result.totalVolumeCredits = totalVolumeCredits(result)

  return result

  function createPerfomanceCalculator(aPerformance, aPlay) {
    /* 
    함수안에서 생성자 함수 호출하지 않고 팩토리 함수로 분리해서 의존성을 줄인다.
    */
    // return new PerformanceCalculator(aPerformance, aPlay)

    switch (aPlay.type) {
      case 'tragedy':
        return new TragedyCalculator(aPerformance, aPlay)
      case 'comedy':
        return new ComedyCalculator(aPerformance, aPlay)

      default:
        throw new Error(`알 수 없는 장르: ${aPlay.type}`)
    }
  }

  function enrichPerformance(aPerformance) {
    /*  const calculator = new PerformanceCalculator(
      aPerformance,
      playFor(aPerformance)
    ) */

    const calculator = createPerfomanceCalculator(
      aPerformance,
      playFor(aPerformance)
    )

    const result = Object.assign({}, aPerformance)
    result.play = calculator.play
    result.amount = calculator.amount
    result.volumeCredits = calculator.volumeCredits
    return result
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID]
  }

  function totalAmount(data) {
    return data.performances.reduce((total, p) => total + p.amount, 0)
  }

  function totalVolumeCredits(data) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0)
  }
}

function renderPlainText(data) {
  let result = `청구내역 (고객명: ${data.customer})\n`

  for (let perf of data.performances) {
    result += `${perf.play.name} : ${usd(perf.amount)} (${perf.audience}석)\n`
  }

  result += `총액: ${usd(data.totalAmount)}\n`
  result += `적립 포인트: ${data.totalVolumeCredits}점\n`

  return result
}

export function htmlStatement(invoice, plays) {
  return renderHtml(
    createStatementData(invoice, plays)
  ) /* 중간 데이터 생성 함수를 공유 */
}

function renderHtml(data) {
  let result = `<h1>청구 내역 (고객명: ${data.customer})</h1>\n`
  result += '<table>\n'
  result += '<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr>'
  for (let perf of data.performances) {
    result += ` <tr><td>${perf.play.name}</td><td>(${perf.audience}석)</td>`
    result += `<td>${usd(perf.amount)}</td></tr>\n`
  }
  result += '</table>\n'
  result += `<p>총액: <em>${usd(data.totalAmount)}</em></p>\n`
  result += `<p>적립 포인트: <em>${data.totalVolumeCredits}</em>점</p>\n`
  return result
}
