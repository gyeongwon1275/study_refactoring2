import statement from './statement.before.js'
import statementStep1 from './statementStep1.js'
import { statement as statementStep2, htmlStatement } from './statementStep2.js'
import { statement as statementStep3 } from './statementStep3.js'
import { invoices, plays } from './mock.js'

describe('statement', () => {
  let result = ''

  describe('before refactoring', () => {
    beforeEach(() => {
      result =
        '청구내역 (고객명: BigCo)\nhamlet : $650.00 (55석)\nAs You Like It : $580.00 (35석)\nOthello : $500.00 (40석)\n총액: $1,730.00\n적립 포인트: 47점\n'
    })
    it('공연료 청구서를 반환합니다.', () => {
      expect(statement(invoices[0], plays)).toEqual(result)
    })
  })

  describe('statement 함수 내부 로직을 각 단계별로 별도의 함수로 분리함', () => {
    beforeEach(() => {
      result =
        '청구내역 (고객명: BigCo)\nhamlet : $650.00 (55석)\nAs You Like It : $580.00 (35석)\nOthello : $500.00 (40석)\n총액: $1,730.00\n적립 포인트: 47점\n'
    })
    it('공연료 청구서를 반환합니다.', () => {
      expect(statementStep1(invoices[0], plays)).toEqual(result)
    })
  })

  describe('요금 계산 로직을 별도로 분리함 (createStatementData)', () => {
    describe('renderText', () => {
      beforeEach(() => {
        result =
          '청구내역 (고객명: BigCo)\nhamlet : $650.00 (55석)\nAs You Like It : $580.00 (35석)\nOthello : $500.00 (40석)\n총액: $1,730.00\n적립 포인트: 47점\n'
      })
      it('공연료 청구서를 반환합니다.', () => {
        expect(statementStep2(invoices[0], plays)).toEqual(result)
      })
    })

    describe('renderHtml', () => {
      beforeEach(() => {
        result =
          '<h1>청구 내역 (고객명: BigCo)</h1>\n<table>\n<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr> <tr><td>hamlet</td><td>(55석)</td><td>$650.00</td></tr>\n <tr><td>As You Like It</td><td>(35석)</td><td>$580.00</td></tr>\n <tr><td>Othello</td><td>(40석)</td><td>$500.00</td></tr>\n</table>\n<p>총액: <em>$1,730.00</em></p>\n<p>적립 포인트: <em>47</em>점</p>\n'
      })
      it('html', () => {
        expect(htmlStatement(invoices[0], plays)).toEqual(result)
      })
    })
  })

  describe('다형성을 활용해 계산코드 재구성하기', () => {
    beforeEach(() => {
      result =
        '청구내역 (고객명: BigCo)\nhamlet : $650.00 (55석)\nAs You Like It : $580.00 (35석)\nOthello : $500.00 (40석)\n총액: $1,730.00\n적립 포인트: 47점\n'
    })

    /* amountFor, volumnCreditsFor 를 전용 클래스로 옮긴다. */
    it('공연료 청구서를 반환합니다.', () => {
      expect(statementStep3(invoices[0], plays)).toEqual(result)
    })
  })
})
