### VueJS VueX로 클레이튼 VApp 개발하기 책 예제(ch.8)

# 주의사항
- chai 사용시 if 아니라 it(왜 오류 났는지 한참 못 찾음)

# 이슈
- truffle-hdwallet-provider-klaytn / npm 설치시 오류 남
- 현재 해결되었으나 어떤 방법으로 해결된 건지 확인 필요(다른 컴퓨터에서 다시 테스트 예정)
    - python 2.7 버전 설치
    - nvm으로 node 10 버전 설치 및 use (10 버전 최신인 v10.22.0 사용)
    - npm install --global --production windows-build-tools(관리자 권한 필요)
    - npm install --global node-gyp

# 후기
- truffle-hdwallet-provider-klaytn를 설치하는 것부터 문제가 생기니 포기하고 caver.js만 사용해야겠다고 생각했으나 어떻게든 해결이 되어서 다행
- 교육원 노트북으로 다시 테스트해보고 재정리하면 추후에도 도움이 될 듯
- 클레이튼 해보려다가 truffle-hdwallet-provider-klaytn 모듈 때문에 좌절하신 분들 꽤 있을 듯...
- 공부하려고 하는 건데 안 풀리기 시작하니 이해하고 넘어가기보다 따라치기 바빴던 듯 그래도 해결되고 정상 실행되어서 다행
- 추가 진행 중 vue 코드 중복으로 치는 게 너무 지쳐서 MyWallet.vue와 Marketplace.vue는 예제 파일에서 복붙
- 완성하고 시작하여 화면은 보았으나 계정 연동이 안 됨
- 예제파일도 실행했으나 증상 동일
- 찾아서 해결해야 하지만 실습해본 것에 의의를 두고 프로젝트와 동일하게 react로 된 공식 docs 예제를 따라하기로
- 예제 두 개를 해보고 vue 사용에 대한 대략적인 느낌과 klaytn과 웹 연동이 이루어지는 방식을 배움