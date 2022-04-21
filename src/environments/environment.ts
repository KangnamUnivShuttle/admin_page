// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,

  host: 'https://kws1.gapmoe.net/',

  DEFAULT_RUNTIME_ID: 'untitled',


  MSG_DELETE_WARN: '정말로 삭제하시겠습니까?',
  MSG_CHANGE_STATE_WARN: '정말로 상태를 변경하시겠습니까?',
  MSG_OK: '정상 처리 되었습니다.',
  MSG_SOME_FAIL: '일부 데이터가 처리 중 문제가 발생했습니다.',
  MSG_FAIL_TO_CREATE_BLOCK: '블록 생성 중 문제가 발생했습니다. '
};
