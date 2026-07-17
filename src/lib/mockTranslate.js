const FIXED_CASES = [
  {
    match: /단디\s*보소.*오천\s*원/,
    standard_korean: '자세히 보세요, 오천 원입니다.',
    translated_text: 'Take a close look, it is 5,000 won.',
    confidence_score: 0.98,
  },
  {
    match: /그거\s*매끼\s*놔라/,
    standard_korean:
      '그것을 맡겨두세요. (또는 "그것을 그냥 내버려 두세요"로 해석될 수 있습니다.)',
    translated_text:
      'Please leave it to me. (Note: depending on context, it could also mean "Leave it as it is".)',
    confidence_score: 0.62,
  },
  {
    match: /단디\s*보소.*이만\s*오천/,
    standard_korean:
      '자세히 보세요, 이거 원래 삼만 원인데 오천 원 깎아드려서 이만 오천 원만 주세요.',
    translated_text:
      "Take a close look. It's originally 30,000 won, but I'll give you a 5,000 won discount. Just pay 25,000 won.",
    confidence_score: 0.95,
  },
]

const DIALECT_MAP = [
  [/단디/g, '자세히/야무지게'],
  [/보소/g, '보세요'],
  [/이라예/g, '입니다'],
  [/하이소/g, '하세요'],
  [/주이소/g, '주세요'],
  [/맞나/g, '맞습니까'],
  [/뭐라카노/g, '뭐라고 하시나요'],
  [/억수로/g, '매우'],
  [/쫌/g, '좀'],
]

function heuristicConvert(text) {
  let standard = text
  let hits = 0
  for (const [pattern, replacement] of DIALECT_MAP) {
    if (pattern.test(standard)) {
      hits += 1
      standard = standard.replace(pattern, replacement)
    }
  }
  const confidence = hits > 0 ? Math.min(0.95, 0.55 + hits * 0.12) : 0.58
  return { standard, confidence }
}

export function runTranslation(dialectText, options = {}) {
  const { region = 'Gyeongsang' } = options

  return new Promise((resolve) => {
    const latency = 900 + Math.random() * 700

    setTimeout(() => {
      const fixed = FIXED_CASES.find((c) => c.match.test(dialectText))

      let result
      if (fixed) {
        result = {
          standard_korean: fixed.standard_korean,
          translated_text: fixed.translated_text,
          confidence_score: fixed.confidence_score,
        }
      } else {
        const { standard, confidence } = heuristicConvert(dialectText)
        result = {
          standard_korean: standard,
          translated_text: `[MOCK EN] ${standard}`,
          confidence_score: Number(confidence.toFixed(2)),
        }
      }

      resolve({
        ...result,
        region,
        needs_reconfirmation: result.confidence_score < 0.7,
      })
    }, latency)
  })
}