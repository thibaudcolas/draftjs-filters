# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.3.0"></a>
# [0.3.0](https://github.com/thibaudcolas/draftjs-filters/compare/v0.2.2...v0.3.0) (2018-01-15)


### Bug Fixes

* **filters:** fix bug preventing atomic block text reset ([6807077](https://github.com/thibaudcolas/draftjs-filters/commit/6807077))
* **filters:** fix filterEditorState discarding updated state ([cec872e](https://github.com/thibaudcolas/draftjs-filters/commit/cec872e))
* **filters:** stop preserveAtomicBlocks resetting blocks with text ([04d0554](https://github.com/thibaudcolas/draftjs-filters/commit/04d0554))
* **release:** add changelog and git plugins to semantic-release ([23ca249](https://github.com/thibaudcolas/draftjs-filters/commit/23ca249))
* **release:** completely remove semantic-release ([4612000](https://github.com/thibaudcolas/draftjs-filters/commit/4612000))
* **release:** debug semantic-release publishing in feature branch ([e063656](https://github.com/thibaudcolas/draftjs-filters/commit/e063656))
* **release:** disable semantic-release for now ([5691e7e](https://github.com/thibaudcolas/draftjs-filters/commit/5691e7e))
* **release:** re-enable semantic-release, with a more recent version ([a621e99](https://github.com/thibaudcolas/draftjs-filters/commit/a621e99))


### Features

* **api:** add blockEntities opt for preserveAtomicBlocks ([a2fc941](https://github.com/thibaudcolas/draftjs-filters/commit/a2fc941))
* **api:** add enableLineBreak option to filterEditorState ([6c334b3](https://github.com/thibaudcolas/draftjs-filters/commit/6c334b3))
* **api:** change filterEditorState to separate options & input ([32a4586](https://github.com/thibaudcolas/draftjs-filters/commit/32a4586))
* **api:** change filterEditorState to take object as param, with keys ([cbac155](https://github.com/thibaudcolas/draftjs-filters/commit/cbac155))
* **api:** entity data filter keeps all data if no whitelist is defined ([83199dd](https://github.com/thibaudcolas/draftjs-filters/commit/83199dd))
* **api:** expose all filters to package consumers ([606f8a0](https://github.com/thibaudcolas/draftjs-filters/commit/606f8a0))
* **api:** expose new whitespaceCharacters method to the API ([9b3057d](https://github.com/thibaudcolas/draftjs-filters/commit/9b3057d))
* **api:** filter by attr should keep entity if there is no whitelist ([514e093](https://github.com/thibaudcolas/draftjs-filters/commit/514e093))
* **api:** refactor all filters to work on ContentState ([6c7fbaf](https://github.com/thibaudcolas/draftjs-filters/commit/6c7fbaf))
* **api:** refactor entity filters to iterator + callback pattern ([1e6d3f2](https://github.com/thibaudcolas/draftjs-filters/commit/1e6d3f2))
* **api:** remove enableHorizontalRule - use entities instead ([4603a36](https://github.com/thibaudcolas/draftjs-filters/commit/4603a36))
* **api:** rename entityTypes option to entities ([38ae203](https://github.com/thibaudcolas/draftjs-filters/commit/38ae203))
* **api:** rename filterEntityAttributes to filterEntityData ([9403ca2](https://github.com/thibaudcolas/draftjs-filters/commit/9403ca2))
* **api:** replace enableLineBreak with whitespacedCharacters ([a0c7745](https://github.com/thibaudcolas/draftjs-filters/commit/a0c7745))
* **filters:** add filterEntityAttributes to filterEditorState ([ab0a30e](https://github.com/thibaudcolas/draftjs-filters/commit/ab0a30e))
* **filters:** add new filterEntityAttributes filter w/ whitelist ([745ba09](https://github.com/thibaudcolas/draftjs-filters/commit/745ba09))
* **filters:** add new whitespaceCharacters method ([6fde9ee](https://github.com/thibaudcolas/draftjs-filters/commit/6fde9ee))
* **filters:** add removeInvalidDepthBlocks method to API ([5139451](https://github.com/thibaudcolas/draftjs-filters/commit/5139451))
* **filters:** implement entity filtering by attribute ([ae76945](https://github.com/thibaudcolas/draftjs-filters/commit/ae76945))
* **filters:** preserve atomic blocks based on image emoji ([fba9880](https://github.com/thibaudcolas/draftjs-filters/commit/fba9880))
* **filters:** remove atomic blocks instead of making them unstyled ([31b7664](https://github.com/thibaudcolas/draftjs-filters/commit/31b7664))
* **filters:** remove tabs as part of filterEditorState ([9fd0005](https://github.com/thibaudcolas/draftjs-filters/commit/9fd0005))
* **filters:** start updating filter methods to work on ContentState ([e716dd9](https://github.com/thibaudcolas/draftjs-filters/commit/e716dd9))
* **filters:** update whitespaceCharacters to operate on ContentState ([62fef11](https://github.com/thibaudcolas/draftjs-filters/commit/62fef11))



<a name="0.1.0"></a>

# 0.1.0 (2018-01-10)

### Features

* add normalize code from Draftail ([c2fdc87](https://github.com/thibaudcolas/draftjs-filters/commit/c2fdc87))
* add type annotations to current normalize API ([7d432c9](https://github.com/thibaudcolas/draftjs-filters/commit/7d432c9))
* refactor normalize API to use separate ES6 exports ([030e458](https://github.com/thibaudcolas/draftjs-filters/commit/030e458))
