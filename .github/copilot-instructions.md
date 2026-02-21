## 목적
이 문서는 이 저장소에서 AI 코딩 에이전트가 바로 생산적으로 작업할 수 있도록, 프로젝트 구조·빌드·컨벤션·핵심 패턴을 요약합니다.

## 빠른 시작 (핵심 명령)
- 개발 서버: `npm run dev`  (Vite) — 기본 포트 5173에서 HMR 작동
- 프로덕션 빌드: `npm run build`  (먼저 `tsc -b`가 실행됨 — 프로젝트 참조 사용)
- 정적 미리보기: `npm run preview` (vite preview)
- 린트: `npm run lint` (프로젝트 루트에서 `eslint .` 실행)

참고: 일부 컴포넌트(`components/Flex.tsx`, `components/Text.tsx`)는 `styled-components`를 사용합니다. 이 패키지가 package.json에 없으면 개발 전에 `npm i styled-components`와 타입이 필요하면 `npm i -D @types/styled-components`를 설치하세요.

## 큰 그림: 아키텍처와 진입점
- 빌드/런타임: Vite + React + TypeScript 템플릿. Vite 플러그인: `@vitejs/plugin-react` (vite.config.ts)
- 진입점: `index.html` -> `src/main.tsx` -> `src/App.tsx`
- UI 컴포넌트: `components/` 에서 재사용 가능한 스타일드 컴포넌트가 정의됨 (기본 export)
- 글로벌 스타일: `src/index.css`, `src/App.css`
- 타입스크립트: `tsconfig.json`이 `tsconfig.app.json`와 `tsconfig.node.json`을 참조합니다. 빌드 시 `tsc -b`를 실행하므로 참조 트리를 유지하세요.

## 프로젝트 규칙/관습 (발견 가능한 것만)
- 컴포넌트는 PascalCase 파일명과 `default export`를 사용합니다. (예: `components/Flex.tsx`)
- 스타일링은 `styled-components`에 의해 컴포넌트 내부에서 관리됩니다. 새로운 레이아웃/텍스트 스타일은 기존 `Flex`/`Text`를 재사용하세요.
- `Flex`와 `Text`의 주요 prop 예시:
  - `Flex` : `row`, `gap`, `center`, `spaceBetween`, `width`, `height`, `flexWrap` 등
  - `Text` : `fontSize` (number 또는 string), `fontWeight`, `color`, `noWrap`, `breakSpaces`, `lineThrough`
  예: `<Flex row gap={8} center><Text fontSize={14}>안내</Text></Flex>`
- 타입 안정성을 위해 새 컴포넌트에 명확한 prop 타입을 추가하세요 (.tsx)

## 린트, 타입체크, 빌드 주의사항
- `eslint.config.js`가 프로젝트의 규칙을 결정합니다 (typescript-eslint, react-hooks 등). 자동 수정이 필요하면 `eslint --fix`를 고려하되, 변경 범위를 작게 유지하세요.
- `npm run build`는 `tsc -b`를 먼저 실행합니다. 타입 오류가 빌드를 중단시키므로 타입 정의/참조가 올바른지 확인하세요.

## 디버깅/개발 팁
- 빠른 로컬 확인: `npm run dev` 후 브라우저에서 `http://localhost:5173` 열기
- HMR과 React StrictMode(`src/main.tsx`)가 활성화되어 있어, 상태 변경과 리렌더링 문제를 빠르게 확인할 수 있습니다.

## 변경/PR 가이드라인 (간단한 규칙)
- 스타일 변경은 가능하면 기존 `components/Flex.tsx`와 `components/Text.tsx`의 prop을 확장해 재사용하세요.
- 새 의존성 추가 시 package.json에 반영하고 설명을 커밋 메시지에 명시하세요.
- 빌드/타입 오류는 PR에서 실패 원인이 되므로 로컬에서 `npm run build`를 반드시 확인하세요.

## 핵심 파일(참조)
- `package.json` — 스크립트와 의존성
- `vite.config.ts` — Vite 플러그인/설정
- `eslint.config.js` — 린트 규칙
- `src/main.tsx`, `src/App.tsx`, `index.html` — 앱 진입 경로
- `components/Flex.tsx`, `components/Text.tsx` — 재사용 UI 패턴
- `src/index.css`, `src/App.css` — 전역 스타일

문서가 불명확하거나 더 깊은 컨텍스트(예: 의도된 스타일 가이드, 추가 런타임 의존성 등)가 필요하면 알려주세요. 피드백을 반영해 항목을 정리·확장하겠습니다.
