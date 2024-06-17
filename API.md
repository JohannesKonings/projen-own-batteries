# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### OwnBatteriesBaseProject <a name="OwnBatteriesBaseProject" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject"></a>

TypeScript library.

#### Initializers <a name="Initializers" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.Initializer"></a>

```typescript
import { OwnBatteriesBaseProject } from '@jaykingson/projen-own-batteries'

new OwnBatteriesBaseProject(options: OwnBatteriesProjectBaseOptions)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.Initializer.parameter.options">options</a></code> | <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProjectBaseOptions">OwnBatteriesProjectBaseOptions</a></code> | *No description.* |

---

##### `options`<sup>Required</sup> <a name="options" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.Initializer.parameter.options"></a>

- *Type:* <a href="#@jaykingson/projen-own-batteries.OwnBatteriesProjectBaseOptions">OwnBatteriesProjectBaseOptions</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.addExcludeFromCleanup">addExcludeFromCleanup</a></code> | Exclude the matching files from pre-synth cleanup. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.addGitIgnore">addGitIgnore</a></code> | Adds a .gitignore pattern. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.addPackageIgnore">addPackageIgnore</a></code> | Exclude these files from the bundled package. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.addTask">addTask</a></code> | Adds a new task to this project. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.addTip">addTip</a></code> | Prints a "tip" message during synthesis. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.annotateGenerated">annotateGenerated</a></code> | Consider a set of files as "generated". |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.postSynthesize">postSynthesize</a></code> | Called after all components are synthesized. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.preSynthesize">preSynthesize</a></code> | Called before all components are synthesized. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.removeTask">removeTask</a></code> | Removes a task from a project. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.runTaskCommand">runTaskCommand</a></code> | Returns the shell command to execute in order to run a task. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.synth">synth</a></code> | Synthesize all project files into `outdir`. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.tryFindFile">tryFindFile</a></code> | Finds a file at the specified relative path within this project and all its subprojects. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.tryFindJsonFile">tryFindJsonFile</a></code> | Finds a json file by name. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.tryFindObjectFile">tryFindObjectFile</a></code> | Finds an object file (like JsonFile, YamlFile, etc.) by name. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.tryRemoveFile">tryRemoveFile</a></code> | Finds a file at the specified relative path within this project and removes it. |

---

##### `toString` <a name="toString" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addExcludeFromCleanup` <a name="addExcludeFromCleanup" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.addExcludeFromCleanup"></a>

```typescript
public addExcludeFromCleanup(globs: string): void
```

Exclude the matching files from pre-synth cleanup.

Can be used when, for example, some
source files include the projen marker and we don't want them to be erased during synth.

###### `globs`<sup>Required</sup> <a name="globs" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.addExcludeFromCleanup.parameter.globs"></a>

- *Type:* string

The glob patterns to match.

---

##### `addGitIgnore` <a name="addGitIgnore" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.addGitIgnore"></a>

```typescript
public addGitIgnore(pattern: string): void
```

Adds a .gitignore pattern.

###### `pattern`<sup>Required</sup> <a name="pattern" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.addGitIgnore.parameter.pattern"></a>

- *Type:* string

The glob pattern to ignore.

---

##### `addPackageIgnore` <a name="addPackageIgnore" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.addPackageIgnore"></a>

```typescript
public addPackageIgnore(_pattern: string): void
```

Exclude these files from the bundled package.

Implemented by project types based on the
packaging mechanism. For example, `NodeProject` delegates this to `.npmignore`.

###### `_pattern`<sup>Required</sup> <a name="_pattern" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.addPackageIgnore.parameter._pattern"></a>

- *Type:* string

The glob pattern to exclude.

---

##### `addTask` <a name="addTask" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.addTask"></a>

```typescript
public addTask(name: string, props?: TaskOptions): Task
```

Adds a new task to this project.

This will fail if the project already has
a task with this name.

###### `name`<sup>Required</sup> <a name="name" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.addTask.parameter.name"></a>

- *Type:* string

The task name to add.

---

###### `props`<sup>Optional</sup> <a name="props" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.addTask.parameter.props"></a>

- *Type:* projen.TaskOptions

Task properties.

---

##### ~~`addTip`~~ <a name="addTip" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.addTip"></a>

```typescript
public addTip(message: string): void
```

Prints a "tip" message during synthesis.

###### `message`<sup>Required</sup> <a name="message" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.addTip.parameter.message"></a>

- *Type:* string

The message.

---

##### `annotateGenerated` <a name="annotateGenerated" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.annotateGenerated"></a>

```typescript
public annotateGenerated(_glob: string): void
```

Consider a set of files as "generated".

This method is implemented by
derived classes and used for example, to add git attributes to tell GitHub
that certain files are generated.

###### `_glob`<sup>Required</sup> <a name="_glob" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.annotateGenerated.parameter._glob"></a>

- *Type:* string

the glob pattern to match (could be a file path).

---

##### `postSynthesize` <a name="postSynthesize" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.postSynthesize"></a>

```typescript
public postSynthesize(): void
```

Called after all components are synthesized.

Order is *not* guaranteed.

##### `preSynthesize` <a name="preSynthesize" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.preSynthesize"></a>

```typescript
public preSynthesize(): void
```

Called before all components are synthesized.

##### `removeTask` <a name="removeTask" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.removeTask"></a>

```typescript
public removeTask(name: string): Task
```

Removes a task from a project.

###### `name`<sup>Required</sup> <a name="name" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.removeTask.parameter.name"></a>

- *Type:* string

The name of the task to remove.

---

##### `runTaskCommand` <a name="runTaskCommand" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.runTaskCommand"></a>

```typescript
public runTaskCommand(task: Task): string
```

Returns the shell command to execute in order to run a task.

By default, this is `npx projen@<version> <task>`

###### `task`<sup>Required</sup> <a name="task" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.runTaskCommand.parameter.task"></a>

- *Type:* projen.Task

The task for which the command is required.

---

##### `synth` <a name="synth" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.synth"></a>

```typescript
public synth(): void
```

Synthesize all project files into `outdir`.

1. Call "this.preSynthesize()"
2. Delete all generated files
3. Synthesize all subprojects
4. Synthesize all components of this project
5. Call "postSynthesize()" for all components of this project
6. Call "this.postSynthesize()"

##### `tryFindFile` <a name="tryFindFile" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.tryFindFile"></a>

```typescript
public tryFindFile(filePath: string): FileBase
```

Finds a file at the specified relative path within this project and all its subprojects.

###### `filePath`<sup>Required</sup> <a name="filePath" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.tryFindFile.parameter.filePath"></a>

- *Type:* string

The file path.

If this path is relative, it will be resolved
from the root of _this_ project.

---

##### ~~`tryFindJsonFile`~~ <a name="tryFindJsonFile" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.tryFindJsonFile"></a>

```typescript
public tryFindJsonFile(filePath: string): JsonFile
```

Finds a json file by name.

###### `filePath`<sup>Required</sup> <a name="filePath" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.tryFindJsonFile.parameter.filePath"></a>

- *Type:* string

The file path.

---

##### `tryFindObjectFile` <a name="tryFindObjectFile" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.tryFindObjectFile"></a>

```typescript
public tryFindObjectFile(filePath: string): ObjectFile
```

Finds an object file (like JsonFile, YamlFile, etc.) by name.

###### `filePath`<sup>Required</sup> <a name="filePath" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.tryFindObjectFile.parameter.filePath"></a>

- *Type:* string

The file path.

---

##### `tryRemoveFile` <a name="tryRemoveFile" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.tryRemoveFile"></a>

```typescript
public tryRemoveFile(filePath: string): FileBase
```

Finds a file at the specified relative path within this project and removes it.

###### `filePath`<sup>Required</sup> <a name="filePath" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.tryRemoveFile.parameter.filePath"></a>

- *Type:* string

The file path.

If this path is relative, it will be
resolved from the root of _this_ project.

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.isProject">isProject</a></code> | Test whether the given construct is a project. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.of">of</a></code> | Find the closest ancestor project for given construct. |

---

##### `isConstruct` <a name="isConstruct" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.isConstruct"></a>

```typescript
import { OwnBatteriesBaseProject } from '@jaykingson/projen-own-batteries'

OwnBatteriesBaseProject.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isProject` <a name="isProject" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.isProject"></a>

```typescript
import { OwnBatteriesBaseProject } from '@jaykingson/projen-own-batteries'

OwnBatteriesBaseProject.isProject(x: any)
```

Test whether the given construct is a project.

###### `x`<sup>Required</sup> <a name="x" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.isProject.parameter.x"></a>

- *Type:* any

---

##### `of` <a name="of" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.of"></a>

```typescript
import { OwnBatteriesBaseProject } from '@jaykingson/projen-own-batteries'

OwnBatteriesBaseProject.of(construct: IConstruct)
```

Find the closest ancestor project for given construct.

When given a project, this it the project itself.

###### `construct`<sup>Required</sup> <a name="construct" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.of.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.buildTask">buildTask</a></code> | <code>projen.Task</code> | *No description.* |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.commitGenerated">commitGenerated</a></code> | <code>boolean</code> | Whether to commit the managed files by default. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.compileTask">compileTask</a></code> | <code>projen.Task</code> | *No description.* |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.components">components</a></code> | <code>projen.Component[]</code> | Returns all the components within this project. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.deps">deps</a></code> | <code>projen.Dependencies</code> | Project dependencies. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.ejected">ejected</a></code> | <code>boolean</code> | Whether or not the project is being ejected. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.files">files</a></code> | <code>projen.FileBase[]</code> | All files in this project. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.gitattributes">gitattributes</a></code> | <code>projen.GitAttributesFile</code> | The .gitattributes file for this repository. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.gitignore">gitignore</a></code> | <code>projen.IgnoreFile</code> | .gitignore. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.logger">logger</a></code> | <code>projen.Logger</code> | Logging utilities. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.name">name</a></code> | <code>string</code> | Project name. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.outdir">outdir</a></code> | <code>string</code> | Absolute output directory of this project. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.packageTask">packageTask</a></code> | <code>projen.Task</code> | *No description.* |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.postCompileTask">postCompileTask</a></code> | <code>projen.Task</code> | *No description.* |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.preCompileTask">preCompileTask</a></code> | <code>projen.Task</code> | *No description.* |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.projectBuild">projectBuild</a></code> | <code>projen.ProjectBuild</code> | Manages the build process of the project. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.projenCommand">projenCommand</a></code> | <code>string</code> | The command to use in order to run the projen CLI. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.root">root</a></code> | <code>projen.Project</code> | The root project. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.subprojects">subprojects</a></code> | <code>projen.Project[]</code> | Returns all the subprojects within this project. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.tasks">tasks</a></code> | <code>projen.Tasks</code> | Project tasks. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.testTask">testTask</a></code> | <code>projen.Task</code> | *No description.* |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.defaultTask">defaultTask</a></code> | <code>projen.Task</code> | This is the "default" task, the one that executes "projen". |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.initProject">initProject</a></code> | <code>projen.InitProject</code> | The options used when this project is bootstrapped via `projen new`. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.parent">parent</a></code> | <code>projen.Project</code> | A parent project. |

---

##### `node`<sup>Required</sup> <a name="node" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `buildTask`<sup>Required</sup> <a name="buildTask" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.buildTask"></a>

```typescript
public readonly buildTask: Task;
```

- *Type:* projen.Task

---

##### `commitGenerated`<sup>Required</sup> <a name="commitGenerated" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.commitGenerated"></a>

```typescript
public readonly commitGenerated: boolean;
```

- *Type:* boolean

Whether to commit the managed files by default.

---

##### `compileTask`<sup>Required</sup> <a name="compileTask" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.compileTask"></a>

```typescript
public readonly compileTask: Task;
```

- *Type:* projen.Task

---

##### `components`<sup>Required</sup> <a name="components" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.components"></a>

```typescript
public readonly components: Component[];
```

- *Type:* projen.Component[]

Returns all the components within this project.

---

##### `deps`<sup>Required</sup> <a name="deps" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.deps"></a>

```typescript
public readonly deps: Dependencies;
```

- *Type:* projen.Dependencies

Project dependencies.

---

##### `ejected`<sup>Required</sup> <a name="ejected" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.ejected"></a>

```typescript
public readonly ejected: boolean;
```

- *Type:* boolean

Whether or not the project is being ejected.

---

##### `files`<sup>Required</sup> <a name="files" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.files"></a>

```typescript
public readonly files: FileBase[];
```

- *Type:* projen.FileBase[]

All files in this project.

---

##### `gitattributes`<sup>Required</sup> <a name="gitattributes" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.gitattributes"></a>

```typescript
public readonly gitattributes: GitAttributesFile;
```

- *Type:* projen.GitAttributesFile

The .gitattributes file for this repository.

---

##### `gitignore`<sup>Required</sup> <a name="gitignore" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.gitignore"></a>

```typescript
public readonly gitignore: IgnoreFile;
```

- *Type:* projen.IgnoreFile

.gitignore.

---

##### `logger`<sup>Required</sup> <a name="logger" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.logger"></a>

```typescript
public readonly logger: Logger;
```

- *Type:* projen.Logger

Logging utilities.

---

##### `name`<sup>Required</sup> <a name="name" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

Project name.

---

##### `outdir`<sup>Required</sup> <a name="outdir" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.outdir"></a>

```typescript
public readonly outdir: string;
```

- *Type:* string

Absolute output directory of this project.

---

##### `packageTask`<sup>Required</sup> <a name="packageTask" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.packageTask"></a>

```typescript
public readonly packageTask: Task;
```

- *Type:* projen.Task

---

##### `postCompileTask`<sup>Required</sup> <a name="postCompileTask" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.postCompileTask"></a>

```typescript
public readonly postCompileTask: Task;
```

- *Type:* projen.Task

---

##### `preCompileTask`<sup>Required</sup> <a name="preCompileTask" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.preCompileTask"></a>

```typescript
public readonly preCompileTask: Task;
```

- *Type:* projen.Task

---

##### `projectBuild`<sup>Required</sup> <a name="projectBuild" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.projectBuild"></a>

```typescript
public readonly projectBuild: ProjectBuild;
```

- *Type:* projen.ProjectBuild

Manages the build process of the project.

---

##### `projenCommand`<sup>Required</sup> <a name="projenCommand" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.projenCommand"></a>

```typescript
public readonly projenCommand: string;
```

- *Type:* string

The command to use in order to run the projen CLI.

---

##### `root`<sup>Required</sup> <a name="root" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.root"></a>

```typescript
public readonly root: Project;
```

- *Type:* projen.Project

The root project.

---

##### `subprojects`<sup>Required</sup> <a name="subprojects" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.subprojects"></a>

```typescript
public readonly subprojects: Project[];
```

- *Type:* projen.Project[]

Returns all the subprojects within this project.

---

##### `tasks`<sup>Required</sup> <a name="tasks" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.tasks"></a>

```typescript
public readonly tasks: Tasks;
```

- *Type:* projen.Tasks

Project tasks.

---

##### `testTask`<sup>Required</sup> <a name="testTask" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.testTask"></a>

```typescript
public readonly testTask: Task;
```

- *Type:* projen.Task

---

##### `defaultTask`<sup>Optional</sup> <a name="defaultTask" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.defaultTask"></a>

```typescript
public readonly defaultTask: Task;
```

- *Type:* projen.Task

This is the "default" task, the one that executes "projen".

Undefined if
the project is being ejected.

---

##### `initProject`<sup>Optional</sup> <a name="initProject" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.initProject"></a>

```typescript
public readonly initProject: InitProject;
```

- *Type:* projen.InitProject

The options used when this project is bootstrapped via `projen new`.

It
includes the original set of options passed to the CLI and also the JSII
FQN of the project type.

---

##### `parent`<sup>Optional</sup> <a name="parent" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.parent"></a>

```typescript
public readonly parent: Project;
```

- *Type:* projen.Project

A parent project.

If undefined, this is the root project.

---

#### Constants <a name="Constants" id="Constants"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.DEFAULT_TASK">DEFAULT_TASK</a></code> | <code>string</code> | The name of the default task (the task executed when `projen` is run without arguments). |

---

##### `DEFAULT_TASK`<sup>Required</sup> <a name="DEFAULT_TASK" id="@jaykingson/projen-own-batteries.OwnBatteriesBaseProject.property.DEFAULT_TASK"></a>

```typescript
public readonly DEFAULT_TASK: string;
```

- *Type:* string

The name of the default task (the task executed when `projen` is run without arguments).

Normally
this task should synthesize the project files.

---

### OwnBatteriesProject <a name="OwnBatteriesProject" id="@jaykingson/projen-own-batteries.OwnBatteriesProject"></a>

TypeScript library.

#### Initializers <a name="Initializers" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.Initializer"></a>

```typescript
import { OwnBatteriesProject } from '@jaykingson/projen-own-batteries'

new OwnBatteriesProject(options: OwnBatteriesProjectOptions)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.Initializer.parameter.options">options</a></code> | <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProjectOptions">OwnBatteriesProjectOptions</a></code> | *No description.* |

---

##### `options`<sup>Required</sup> <a name="options" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.Initializer.parameter.options"></a>

- *Type:* <a href="#@jaykingson/projen-own-batteries.OwnBatteriesProjectOptions">OwnBatteriesProjectOptions</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.addExcludeFromCleanup">addExcludeFromCleanup</a></code> | Exclude the matching files from pre-synth cleanup. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.addGitIgnore">addGitIgnore</a></code> | Adds a .gitignore pattern. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.addPackageIgnore">addPackageIgnore</a></code> | Exclude these files from the bundled package. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.addTask">addTask</a></code> | Adds a new task to this project. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.addTip">addTip</a></code> | Prints a "tip" message during synthesis. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.annotateGenerated">annotateGenerated</a></code> | Consider a set of files as "generated". |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.postSynthesize">postSynthesize</a></code> | Called after all components are synthesized. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.preSynthesize">preSynthesize</a></code> | Called before all components are synthesized. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.removeTask">removeTask</a></code> | Removes a task from a project. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.runTaskCommand">runTaskCommand</a></code> | Returns the shell command to execute in order to run a task. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.synth">synth</a></code> | Synthesize all project files into `outdir`. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.tryFindFile">tryFindFile</a></code> | Finds a file at the specified relative path within this project and all its subprojects. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.tryFindJsonFile">tryFindJsonFile</a></code> | Finds a json file by name. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.tryFindObjectFile">tryFindObjectFile</a></code> | Finds an object file (like JsonFile, YamlFile, etc.) by name. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.tryRemoveFile">tryRemoveFile</a></code> | Finds a file at the specified relative path within this project and removes it. |

---

##### `toString` <a name="toString" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addExcludeFromCleanup` <a name="addExcludeFromCleanup" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.addExcludeFromCleanup"></a>

```typescript
public addExcludeFromCleanup(globs: string): void
```

Exclude the matching files from pre-synth cleanup.

Can be used when, for example, some
source files include the projen marker and we don't want them to be erased during synth.

###### `globs`<sup>Required</sup> <a name="globs" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.addExcludeFromCleanup.parameter.globs"></a>

- *Type:* string

The glob patterns to match.

---

##### `addGitIgnore` <a name="addGitIgnore" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.addGitIgnore"></a>

```typescript
public addGitIgnore(pattern: string): void
```

Adds a .gitignore pattern.

###### `pattern`<sup>Required</sup> <a name="pattern" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.addGitIgnore.parameter.pattern"></a>

- *Type:* string

The glob pattern to ignore.

---

##### `addPackageIgnore` <a name="addPackageIgnore" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.addPackageIgnore"></a>

```typescript
public addPackageIgnore(_pattern: string): void
```

Exclude these files from the bundled package.

Implemented by project types based on the
packaging mechanism. For example, `NodeProject` delegates this to `.npmignore`.

###### `_pattern`<sup>Required</sup> <a name="_pattern" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.addPackageIgnore.parameter._pattern"></a>

- *Type:* string

The glob pattern to exclude.

---

##### `addTask` <a name="addTask" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.addTask"></a>

```typescript
public addTask(name: string, props?: TaskOptions): Task
```

Adds a new task to this project.

This will fail if the project already has
a task with this name.

###### `name`<sup>Required</sup> <a name="name" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.addTask.parameter.name"></a>

- *Type:* string

The task name to add.

---

###### `props`<sup>Optional</sup> <a name="props" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.addTask.parameter.props"></a>

- *Type:* projen.TaskOptions

Task properties.

---

##### ~~`addTip`~~ <a name="addTip" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.addTip"></a>

```typescript
public addTip(message: string): void
```

Prints a "tip" message during synthesis.

###### `message`<sup>Required</sup> <a name="message" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.addTip.parameter.message"></a>

- *Type:* string

The message.

---

##### `annotateGenerated` <a name="annotateGenerated" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.annotateGenerated"></a>

```typescript
public annotateGenerated(_glob: string): void
```

Consider a set of files as "generated".

This method is implemented by
derived classes and used for example, to add git attributes to tell GitHub
that certain files are generated.

###### `_glob`<sup>Required</sup> <a name="_glob" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.annotateGenerated.parameter._glob"></a>

- *Type:* string

the glob pattern to match (could be a file path).

---

##### `postSynthesize` <a name="postSynthesize" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.postSynthesize"></a>

```typescript
public postSynthesize(): void
```

Called after all components are synthesized.

Order is *not* guaranteed.

##### `preSynthesize` <a name="preSynthesize" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.preSynthesize"></a>

```typescript
public preSynthesize(): void
```

Called before all components are synthesized.

##### `removeTask` <a name="removeTask" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.removeTask"></a>

```typescript
public removeTask(name: string): Task
```

Removes a task from a project.

###### `name`<sup>Required</sup> <a name="name" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.removeTask.parameter.name"></a>

- *Type:* string

The name of the task to remove.

---

##### `runTaskCommand` <a name="runTaskCommand" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.runTaskCommand"></a>

```typescript
public runTaskCommand(task: Task): string
```

Returns the shell command to execute in order to run a task.

By default, this is `npx projen@<version> <task>`

###### `task`<sup>Required</sup> <a name="task" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.runTaskCommand.parameter.task"></a>

- *Type:* projen.Task

The task for which the command is required.

---

##### `synth` <a name="synth" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.synth"></a>

```typescript
public synth(): void
```

Synthesize all project files into `outdir`.

1. Call "this.preSynthesize()"
2. Delete all generated files
3. Synthesize all subprojects
4. Synthesize all components of this project
5. Call "postSynthesize()" for all components of this project
6. Call "this.postSynthesize()"

##### `tryFindFile` <a name="tryFindFile" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.tryFindFile"></a>

```typescript
public tryFindFile(filePath: string): FileBase
```

Finds a file at the specified relative path within this project and all its subprojects.

###### `filePath`<sup>Required</sup> <a name="filePath" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.tryFindFile.parameter.filePath"></a>

- *Type:* string

The file path.

If this path is relative, it will be resolved
from the root of _this_ project.

---

##### ~~`tryFindJsonFile`~~ <a name="tryFindJsonFile" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.tryFindJsonFile"></a>

```typescript
public tryFindJsonFile(filePath: string): JsonFile
```

Finds a json file by name.

###### `filePath`<sup>Required</sup> <a name="filePath" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.tryFindJsonFile.parameter.filePath"></a>

- *Type:* string

The file path.

---

##### `tryFindObjectFile` <a name="tryFindObjectFile" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.tryFindObjectFile"></a>

```typescript
public tryFindObjectFile(filePath: string): ObjectFile
```

Finds an object file (like JsonFile, YamlFile, etc.) by name.

###### `filePath`<sup>Required</sup> <a name="filePath" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.tryFindObjectFile.parameter.filePath"></a>

- *Type:* string

The file path.

---

##### `tryRemoveFile` <a name="tryRemoveFile" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.tryRemoveFile"></a>

```typescript
public tryRemoveFile(filePath: string): FileBase
```

Finds a file at the specified relative path within this project and removes it.

###### `filePath`<sup>Required</sup> <a name="filePath" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.tryRemoveFile.parameter.filePath"></a>

- *Type:* string

The file path.

If this path is relative, it will be
resolved from the root of _this_ project.

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.isProject">isProject</a></code> | Test whether the given construct is a project. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.of">of</a></code> | Find the closest ancestor project for given construct. |

---

##### `isConstruct` <a name="isConstruct" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.isConstruct"></a>

```typescript
import { OwnBatteriesProject } from '@jaykingson/projen-own-batteries'

OwnBatteriesProject.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isProject` <a name="isProject" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.isProject"></a>

```typescript
import { OwnBatteriesProject } from '@jaykingson/projen-own-batteries'

OwnBatteriesProject.isProject(x: any)
```

Test whether the given construct is a project.

###### `x`<sup>Required</sup> <a name="x" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.isProject.parameter.x"></a>

- *Type:* any

---

##### `of` <a name="of" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.of"></a>

```typescript
import { OwnBatteriesProject } from '@jaykingson/projen-own-batteries'

OwnBatteriesProject.of(construct: IConstruct)
```

Find the closest ancestor project for given construct.

When given a project, this it the project itself.

###### `construct`<sup>Required</sup> <a name="construct" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.of.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.property.buildTask">buildTask</a></code> | <code>projen.Task</code> | *No description.* |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.property.commitGenerated">commitGenerated</a></code> | <code>boolean</code> | Whether to commit the managed files by default. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.property.compileTask">compileTask</a></code> | <code>projen.Task</code> | *No description.* |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.property.components">components</a></code> | <code>projen.Component[]</code> | Returns all the components within this project. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.property.deps">deps</a></code> | <code>projen.Dependencies</code> | Project dependencies. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.property.ejected">ejected</a></code> | <code>boolean</code> | Whether or not the project is being ejected. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.property.files">files</a></code> | <code>projen.FileBase[]</code> | All files in this project. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.property.gitattributes">gitattributes</a></code> | <code>projen.GitAttributesFile</code> | The .gitattributes file for this repository. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.property.gitignore">gitignore</a></code> | <code>projen.IgnoreFile</code> | .gitignore. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.property.logger">logger</a></code> | <code>projen.Logger</code> | Logging utilities. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.property.name">name</a></code> | <code>string</code> | Project name. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.property.outdir">outdir</a></code> | <code>string</code> | Absolute output directory of this project. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.property.packageTask">packageTask</a></code> | <code>projen.Task</code> | *No description.* |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.property.postCompileTask">postCompileTask</a></code> | <code>projen.Task</code> | *No description.* |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.property.preCompileTask">preCompileTask</a></code> | <code>projen.Task</code> | *No description.* |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.property.projectBuild">projectBuild</a></code> | <code>projen.ProjectBuild</code> | Manages the build process of the project. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.property.projenCommand">projenCommand</a></code> | <code>string</code> | The command to use in order to run the projen CLI. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.property.root">root</a></code> | <code>projen.Project</code> | The root project. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.property.subprojects">subprojects</a></code> | <code>projen.Project[]</code> | Returns all the subprojects within this project. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.property.tasks">tasks</a></code> | <code>projen.Tasks</code> | Project tasks. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.property.testTask">testTask</a></code> | <code>projen.Task</code> | *No description.* |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.property.defaultTask">defaultTask</a></code> | <code>projen.Task</code> | This is the "default" task, the one that executes "projen". |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.property.initProject">initProject</a></code> | <code>projen.InitProject</code> | The options used when this project is bootstrapped via `projen new`. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.property.parent">parent</a></code> | <code>projen.Project</code> | A parent project. |

---

##### `node`<sup>Required</sup> <a name="node" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `buildTask`<sup>Required</sup> <a name="buildTask" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.property.buildTask"></a>

```typescript
public readonly buildTask: Task;
```

- *Type:* projen.Task

---

##### `commitGenerated`<sup>Required</sup> <a name="commitGenerated" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.property.commitGenerated"></a>

```typescript
public readonly commitGenerated: boolean;
```

- *Type:* boolean

Whether to commit the managed files by default.

---

##### `compileTask`<sup>Required</sup> <a name="compileTask" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.property.compileTask"></a>

```typescript
public readonly compileTask: Task;
```

- *Type:* projen.Task

---

##### `components`<sup>Required</sup> <a name="components" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.property.components"></a>

```typescript
public readonly components: Component[];
```

- *Type:* projen.Component[]

Returns all the components within this project.

---

##### `deps`<sup>Required</sup> <a name="deps" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.property.deps"></a>

```typescript
public readonly deps: Dependencies;
```

- *Type:* projen.Dependencies

Project dependencies.

---

##### `ejected`<sup>Required</sup> <a name="ejected" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.property.ejected"></a>

```typescript
public readonly ejected: boolean;
```

- *Type:* boolean

Whether or not the project is being ejected.

---

##### `files`<sup>Required</sup> <a name="files" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.property.files"></a>

```typescript
public readonly files: FileBase[];
```

- *Type:* projen.FileBase[]

All files in this project.

---

##### `gitattributes`<sup>Required</sup> <a name="gitattributes" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.property.gitattributes"></a>

```typescript
public readonly gitattributes: GitAttributesFile;
```

- *Type:* projen.GitAttributesFile

The .gitattributes file for this repository.

---

##### `gitignore`<sup>Required</sup> <a name="gitignore" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.property.gitignore"></a>

```typescript
public readonly gitignore: IgnoreFile;
```

- *Type:* projen.IgnoreFile

.gitignore.

---

##### `logger`<sup>Required</sup> <a name="logger" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.property.logger"></a>

```typescript
public readonly logger: Logger;
```

- *Type:* projen.Logger

Logging utilities.

---

##### `name`<sup>Required</sup> <a name="name" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

Project name.

---

##### `outdir`<sup>Required</sup> <a name="outdir" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.property.outdir"></a>

```typescript
public readonly outdir: string;
```

- *Type:* string

Absolute output directory of this project.

---

##### `packageTask`<sup>Required</sup> <a name="packageTask" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.property.packageTask"></a>

```typescript
public readonly packageTask: Task;
```

- *Type:* projen.Task

---

##### `postCompileTask`<sup>Required</sup> <a name="postCompileTask" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.property.postCompileTask"></a>

```typescript
public readonly postCompileTask: Task;
```

- *Type:* projen.Task

---

##### `preCompileTask`<sup>Required</sup> <a name="preCompileTask" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.property.preCompileTask"></a>

```typescript
public readonly preCompileTask: Task;
```

- *Type:* projen.Task

---

##### `projectBuild`<sup>Required</sup> <a name="projectBuild" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.property.projectBuild"></a>

```typescript
public readonly projectBuild: ProjectBuild;
```

- *Type:* projen.ProjectBuild

Manages the build process of the project.

---

##### `projenCommand`<sup>Required</sup> <a name="projenCommand" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.property.projenCommand"></a>

```typescript
public readonly projenCommand: string;
```

- *Type:* string

The command to use in order to run the projen CLI.

---

##### `root`<sup>Required</sup> <a name="root" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.property.root"></a>

```typescript
public readonly root: Project;
```

- *Type:* projen.Project

The root project.

---

##### `subprojects`<sup>Required</sup> <a name="subprojects" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.property.subprojects"></a>

```typescript
public readonly subprojects: Project[];
```

- *Type:* projen.Project[]

Returns all the subprojects within this project.

---

##### `tasks`<sup>Required</sup> <a name="tasks" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.property.tasks"></a>

```typescript
public readonly tasks: Tasks;
```

- *Type:* projen.Tasks

Project tasks.

---

##### `testTask`<sup>Required</sup> <a name="testTask" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.property.testTask"></a>

```typescript
public readonly testTask: Task;
```

- *Type:* projen.Task

---

##### `defaultTask`<sup>Optional</sup> <a name="defaultTask" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.property.defaultTask"></a>

```typescript
public readonly defaultTask: Task;
```

- *Type:* projen.Task

This is the "default" task, the one that executes "projen".

Undefined if
the project is being ejected.

---

##### `initProject`<sup>Optional</sup> <a name="initProject" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.property.initProject"></a>

```typescript
public readonly initProject: InitProject;
```

- *Type:* projen.InitProject

The options used when this project is bootstrapped via `projen new`.

It
includes the original set of options passed to the CLI and also the JSII
FQN of the project type.

---

##### `parent`<sup>Optional</sup> <a name="parent" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.property.parent"></a>

```typescript
public readonly parent: Project;
```

- *Type:* projen.Project

A parent project.

If undefined, this is the root project.

---

#### Constants <a name="Constants" id="Constants"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProject.property.DEFAULT_TASK">DEFAULT_TASK</a></code> | <code>string</code> | The name of the default task (the task executed when `projen` is run without arguments). |

---

##### `DEFAULT_TASK`<sup>Required</sup> <a name="DEFAULT_TASK" id="@jaykingson/projen-own-batteries.OwnBatteriesProject.property.DEFAULT_TASK"></a>

```typescript
public readonly DEFAULT_TASK: string;
```

- *Type:* string

The name of the default task (the task executed when `projen` is run without arguments).

Normally
this task should synthesize the project files.

---

### Sops <a name="Sops" id="@jaykingson/projen-own-batteries.Sops"></a>

#### Initializers <a name="Initializers" id="@jaykingson/projen-own-batteries.Sops.Initializer"></a>

```typescript
import { Sops } from '@jaykingson/projen-own-batteries'

new Sops(project: OwnBatteriesBaseProject)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jaykingson/projen-own-batteries.Sops.Initializer.parameter.project">project</a></code> | <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject">OwnBatteriesBaseProject</a></code> | *No description.* |

---

##### `project`<sup>Required</sup> <a name="project" id="@jaykingson/projen-own-batteries.Sops.Initializer.parameter.project"></a>

- *Type:* <a href="#@jaykingson/projen-own-batteries.OwnBatteriesBaseProject">OwnBatteriesBaseProject</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jaykingson/projen-own-batteries.Sops.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@jaykingson/projen-own-batteries.Sops.postSynthesize">postSynthesize</a></code> | Called after synthesis. |
| <code><a href="#@jaykingson/projen-own-batteries.Sops.preSynthesize">preSynthesize</a></code> | Called before synthesis. |
| <code><a href="#@jaykingson/projen-own-batteries.Sops.synthesize">synthesize</a></code> | Synthesizes files to the project output directory. |

---

##### `toString` <a name="toString" id="@jaykingson/projen-own-batteries.Sops.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `postSynthesize` <a name="postSynthesize" id="@jaykingson/projen-own-batteries.Sops.postSynthesize"></a>

```typescript
public postSynthesize(): void
```

Called after synthesis.

Order is *not* guaranteed.

##### `preSynthesize` <a name="preSynthesize" id="@jaykingson/projen-own-batteries.Sops.preSynthesize"></a>

```typescript
public preSynthesize(): void
```

Called before synthesis.

##### `synthesize` <a name="synthesize" id="@jaykingson/projen-own-batteries.Sops.synthesize"></a>

```typescript
public synthesize(): void
```

Synthesizes files to the project output directory.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jaykingson/projen-own-batteries.Sops.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#@jaykingson/projen-own-batteries.Sops.isComponent">isComponent</a></code> | Test whether the given construct is a component. |

---

##### `isConstruct` <a name="isConstruct" id="@jaykingson/projen-own-batteries.Sops.isConstruct"></a>

```typescript
import { Sops } from '@jaykingson/projen-own-batteries'

Sops.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@jaykingson/projen-own-batteries.Sops.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isComponent` <a name="isComponent" id="@jaykingson/projen-own-batteries.Sops.isComponent"></a>

```typescript
import { Sops } from '@jaykingson/projen-own-batteries'

Sops.isComponent(x: any)
```

Test whether the given construct is a component.

###### `x`<sup>Required</sup> <a name="x" id="@jaykingson/projen-own-batteries.Sops.isComponent.parameter.x"></a>

- *Type:* any

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jaykingson/projen-own-batteries.Sops.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@jaykingson/projen-own-batteries.Sops.property.project">project</a></code> | <code>projen.Project</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@jaykingson/projen-own-batteries.Sops.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `project`<sup>Required</sup> <a name="project" id="@jaykingson/projen-own-batteries.Sops.property.project"></a>

```typescript
public readonly project: Project;
```

- *Type:* projen.Project

---


## Structs <a name="Structs" id="Structs"></a>

### OwnBatteriesProjectBaseOptions <a name="OwnBatteriesProjectBaseOptions" id="@jaykingson/projen-own-batteries.OwnBatteriesProjectBaseOptions"></a>

#### Initializer <a name="Initializer" id="@jaykingson/projen-own-batteries.OwnBatteriesProjectBaseOptions.Initializer"></a>

```typescript
import { OwnBatteriesProjectBaseOptions } from '@jaykingson/projen-own-batteries'

const ownBatteriesProjectBaseOptions: OwnBatteriesProjectBaseOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProjectBaseOptions.property.name">name</a></code> | <code>string</code> | This is the name of your project. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProjectBaseOptions.property.commitGenerated">commitGenerated</a></code> | <code>boolean</code> | Whether to commit the managed files by default. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProjectBaseOptions.property.gitIgnoreOptions">gitIgnoreOptions</a></code> | <code>projen.IgnoreFileOptions</code> | Configuration options for .gitignore file. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProjectBaseOptions.property.gitOptions">gitOptions</a></code> | <code>projen.GitOptions</code> | Configuration options for git. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProjectBaseOptions.property.logging">logging</a></code> | <code>projen.LoggerOptions</code> | Configure logging options such as verbosity. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProjectBaseOptions.property.outdir">outdir</a></code> | <code>string</code> | The root directory of the project. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProjectBaseOptions.property.parent">parent</a></code> | <code>projen.Project</code> | The parent project, if this project is part of a bigger project. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProjectBaseOptions.property.projenCommand">projenCommand</a></code> | <code>string</code> | The shell command to use in order to run the projen CLI. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProjectBaseOptions.property.projenrcJson">projenrcJson</a></code> | <code>boolean</code> | Generate (once) .projenrc.json (in JSON). Set to `false` in order to disable .projenrc.json generation. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProjectBaseOptions.property.projenrcJsonOptions">projenrcJsonOptions</a></code> | <code>projen.ProjenrcJsonOptions</code> | Options for .projenrc.json. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProjectBaseOptions.property.renovatebot">renovatebot</a></code> | <code>boolean</code> | Use renovatebot to handle dependency upgrades. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProjectBaseOptions.property.renovatebotOptions">renovatebotOptions</a></code> | <code>projen.RenovatebotOptions</code> | Options for renovatebot. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProjectBaseOptions.property.componentSops">componentSops</a></code> | <code>boolean</code> | *No description.* |

---

##### `name`<sup>Required</sup> <a name="name" id="@jaykingson/projen-own-batteries.OwnBatteriesProjectBaseOptions.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string
- *Default:* $BASEDIR

This is the name of your project.

---

##### `commitGenerated`<sup>Optional</sup> <a name="commitGenerated" id="@jaykingson/projen-own-batteries.OwnBatteriesProjectBaseOptions.property.commitGenerated"></a>

```typescript
public readonly commitGenerated: boolean;
```

- *Type:* boolean
- *Default:* true

Whether to commit the managed files by default.

---

##### `gitIgnoreOptions`<sup>Optional</sup> <a name="gitIgnoreOptions" id="@jaykingson/projen-own-batteries.OwnBatteriesProjectBaseOptions.property.gitIgnoreOptions"></a>

```typescript
public readonly gitIgnoreOptions: IgnoreFileOptions;
```

- *Type:* projen.IgnoreFileOptions

Configuration options for .gitignore file.

---

##### `gitOptions`<sup>Optional</sup> <a name="gitOptions" id="@jaykingson/projen-own-batteries.OwnBatteriesProjectBaseOptions.property.gitOptions"></a>

```typescript
public readonly gitOptions: GitOptions;
```

- *Type:* projen.GitOptions

Configuration options for git.

---

##### `logging`<sup>Optional</sup> <a name="logging" id="@jaykingson/projen-own-batteries.OwnBatteriesProjectBaseOptions.property.logging"></a>

```typescript
public readonly logging: LoggerOptions;
```

- *Type:* projen.LoggerOptions
- *Default:* {}

Configure logging options such as verbosity.

---

##### `outdir`<sup>Optional</sup> <a name="outdir" id="@jaykingson/projen-own-batteries.OwnBatteriesProjectBaseOptions.property.outdir"></a>

```typescript
public readonly outdir: string;
```

- *Type:* string
- *Default:* "."

The root directory of the project.

Relative to this directory, all files are synthesized.

If this project has a parent, this directory is relative to the parent
directory and it cannot be the same as the parent or any of it's other
subprojects.

---

##### `parent`<sup>Optional</sup> <a name="parent" id="@jaykingson/projen-own-batteries.OwnBatteriesProjectBaseOptions.property.parent"></a>

```typescript
public readonly parent: Project;
```

- *Type:* projen.Project

The parent project, if this project is part of a bigger project.

---

##### `projenCommand`<sup>Optional</sup> <a name="projenCommand" id="@jaykingson/projen-own-batteries.OwnBatteriesProjectBaseOptions.property.projenCommand"></a>

```typescript
public readonly projenCommand: string;
```

- *Type:* string
- *Default:* "npx projen"

The shell command to use in order to run the projen CLI.

Can be used to customize in special environments.

---

##### `projenrcJson`<sup>Optional</sup> <a name="projenrcJson" id="@jaykingson/projen-own-batteries.OwnBatteriesProjectBaseOptions.property.projenrcJson"></a>

```typescript
public readonly projenrcJson: boolean;
```

- *Type:* boolean
- *Default:* false

Generate (once) .projenrc.json (in JSON). Set to `false` in order to disable .projenrc.json generation.

---

##### `projenrcJsonOptions`<sup>Optional</sup> <a name="projenrcJsonOptions" id="@jaykingson/projen-own-batteries.OwnBatteriesProjectBaseOptions.property.projenrcJsonOptions"></a>

```typescript
public readonly projenrcJsonOptions: ProjenrcJsonOptions;
```

- *Type:* projen.ProjenrcJsonOptions
- *Default:* default options

Options for .projenrc.json.

---

##### `renovatebot`<sup>Optional</sup> <a name="renovatebot" id="@jaykingson/projen-own-batteries.OwnBatteriesProjectBaseOptions.property.renovatebot"></a>

```typescript
public readonly renovatebot: boolean;
```

- *Type:* boolean
- *Default:* false

Use renovatebot to handle dependency upgrades.

---

##### `renovatebotOptions`<sup>Optional</sup> <a name="renovatebotOptions" id="@jaykingson/projen-own-batteries.OwnBatteriesProjectBaseOptions.property.renovatebotOptions"></a>

```typescript
public readonly renovatebotOptions: RenovatebotOptions;
```

- *Type:* projen.RenovatebotOptions
- *Default:* default options

Options for renovatebot.

---

##### `componentSops`<sup>Optional</sup> <a name="componentSops" id="@jaykingson/projen-own-batteries.OwnBatteriesProjectBaseOptions.property.componentSops"></a>

```typescript
public readonly componentSops: boolean;
```

- *Type:* boolean

---

### OwnBatteriesProjectOptions <a name="OwnBatteriesProjectOptions" id="@jaykingson/projen-own-batteries.OwnBatteriesProjectOptions"></a>

#### Initializer <a name="Initializer" id="@jaykingson/projen-own-batteries.OwnBatteriesProjectOptions.Initializer"></a>

```typescript
import { OwnBatteriesProjectOptions } from '@jaykingson/projen-own-batteries'

const ownBatteriesProjectOptions: OwnBatteriesProjectOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProjectOptions.property.name">name</a></code> | <code>string</code> | This is the name of your project. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProjectOptions.property.commitGenerated">commitGenerated</a></code> | <code>boolean</code> | Whether to commit the managed files by default. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProjectOptions.property.gitIgnoreOptions">gitIgnoreOptions</a></code> | <code>projen.IgnoreFileOptions</code> | Configuration options for .gitignore file. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProjectOptions.property.gitOptions">gitOptions</a></code> | <code>projen.GitOptions</code> | Configuration options for git. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProjectOptions.property.logging">logging</a></code> | <code>projen.LoggerOptions</code> | Configure logging options such as verbosity. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProjectOptions.property.outdir">outdir</a></code> | <code>string</code> | The root directory of the project. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProjectOptions.property.parent">parent</a></code> | <code>projen.Project</code> | The parent project, if this project is part of a bigger project. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProjectOptions.property.projenCommand">projenCommand</a></code> | <code>string</code> | The shell command to use in order to run the projen CLI. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProjectOptions.property.projenrcJson">projenrcJson</a></code> | <code>boolean</code> | Generate (once) .projenrc.json (in JSON). Set to `false` in order to disable .projenrc.json generation. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProjectOptions.property.projenrcJsonOptions">projenrcJsonOptions</a></code> | <code>projen.ProjenrcJsonOptions</code> | Options for .projenrc.json. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProjectOptions.property.renovatebot">renovatebot</a></code> | <code>boolean</code> | Use renovatebot to handle dependency upgrades. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProjectOptions.property.renovatebotOptions">renovatebotOptions</a></code> | <code>projen.RenovatebotOptions</code> | Options for renovatebot. |
| <code><a href="#@jaykingson/projen-own-batteries.OwnBatteriesProjectOptions.property.componentSops">componentSops</a></code> | <code>boolean</code> | *No description.* |

---

##### `name`<sup>Required</sup> <a name="name" id="@jaykingson/projen-own-batteries.OwnBatteriesProjectOptions.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string
- *Default:* $BASEDIR

This is the name of your project.

---

##### `commitGenerated`<sup>Optional</sup> <a name="commitGenerated" id="@jaykingson/projen-own-batteries.OwnBatteriesProjectOptions.property.commitGenerated"></a>

```typescript
public readonly commitGenerated: boolean;
```

- *Type:* boolean
- *Default:* true

Whether to commit the managed files by default.

---

##### `gitIgnoreOptions`<sup>Optional</sup> <a name="gitIgnoreOptions" id="@jaykingson/projen-own-batteries.OwnBatteriesProjectOptions.property.gitIgnoreOptions"></a>

```typescript
public readonly gitIgnoreOptions: IgnoreFileOptions;
```

- *Type:* projen.IgnoreFileOptions

Configuration options for .gitignore file.

---

##### `gitOptions`<sup>Optional</sup> <a name="gitOptions" id="@jaykingson/projen-own-batteries.OwnBatteriesProjectOptions.property.gitOptions"></a>

```typescript
public readonly gitOptions: GitOptions;
```

- *Type:* projen.GitOptions

Configuration options for git.

---

##### `logging`<sup>Optional</sup> <a name="logging" id="@jaykingson/projen-own-batteries.OwnBatteriesProjectOptions.property.logging"></a>

```typescript
public readonly logging: LoggerOptions;
```

- *Type:* projen.LoggerOptions
- *Default:* {}

Configure logging options such as verbosity.

---

##### `outdir`<sup>Optional</sup> <a name="outdir" id="@jaykingson/projen-own-batteries.OwnBatteriesProjectOptions.property.outdir"></a>

```typescript
public readonly outdir: string;
```

- *Type:* string
- *Default:* "."

The root directory of the project.

Relative to this directory, all files are synthesized.

If this project has a parent, this directory is relative to the parent
directory and it cannot be the same as the parent or any of it's other
subprojects.

---

##### `parent`<sup>Optional</sup> <a name="parent" id="@jaykingson/projen-own-batteries.OwnBatteriesProjectOptions.property.parent"></a>

```typescript
public readonly parent: Project;
```

- *Type:* projen.Project

The parent project, if this project is part of a bigger project.

---

##### `projenCommand`<sup>Optional</sup> <a name="projenCommand" id="@jaykingson/projen-own-batteries.OwnBatteriesProjectOptions.property.projenCommand"></a>

```typescript
public readonly projenCommand: string;
```

- *Type:* string
- *Default:* "npx projen"

The shell command to use in order to run the projen CLI.

Can be used to customize in special environments.

---

##### `projenrcJson`<sup>Optional</sup> <a name="projenrcJson" id="@jaykingson/projen-own-batteries.OwnBatteriesProjectOptions.property.projenrcJson"></a>

```typescript
public readonly projenrcJson: boolean;
```

- *Type:* boolean
- *Default:* false

Generate (once) .projenrc.json (in JSON). Set to `false` in order to disable .projenrc.json generation.

---

##### `projenrcJsonOptions`<sup>Optional</sup> <a name="projenrcJsonOptions" id="@jaykingson/projen-own-batteries.OwnBatteriesProjectOptions.property.projenrcJsonOptions"></a>

```typescript
public readonly projenrcJsonOptions: ProjenrcJsonOptions;
```

- *Type:* projen.ProjenrcJsonOptions
- *Default:* default options

Options for .projenrc.json.

---

##### `renovatebot`<sup>Optional</sup> <a name="renovatebot" id="@jaykingson/projen-own-batteries.OwnBatteriesProjectOptions.property.renovatebot"></a>

```typescript
public readonly renovatebot: boolean;
```

- *Type:* boolean
- *Default:* false

Use renovatebot to handle dependency upgrades.

---

##### `renovatebotOptions`<sup>Optional</sup> <a name="renovatebotOptions" id="@jaykingson/projen-own-batteries.OwnBatteriesProjectOptions.property.renovatebotOptions"></a>

```typescript
public readonly renovatebotOptions: RenovatebotOptions;
```

- *Type:* projen.RenovatebotOptions
- *Default:* default options

Options for renovatebot.

---

##### `componentSops`<sup>Optional</sup> <a name="componentSops" id="@jaykingson/projen-own-batteries.OwnBatteriesProjectOptions.property.componentSops"></a>

```typescript
public readonly componentSops: boolean;
```

- *Type:* boolean

---



