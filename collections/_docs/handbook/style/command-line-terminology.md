# Command-line terminology: infuse command-line tool and Linux

**Key Point:** Use the correct terminology for elements in the `infuse`
command-line tool and in Linux commands. To avoid confusing the reader, however,
it's sometimes preferable to describe _what the entire command does_ rather than
trying to break it down into parts.

This topic discusses what to call the command-line elements that are used in the
`infuse` command-line tool and in Linux commands.

## General guidance

When discussing commands and their constituent parts, follow this guidance:

- Avoid mapping nomenclature of the `infuse` tool's commands to Linux commands.
- Linux commands can be complicated. It's wise to describe what the entire
  command does rather than what its individual elements are called.
- For Linux commands or commands in the `infuse` tool, ask yourself if the
  reader must know the name of the command-line element or if explaining the
  command is sufficient.

## infuse commands

```
infuse GROUP | COMMAND [--account=ACCOUNT] [--configuration=CONFIGURATION] \
    [--flatten=[KEY,...]][--format=FORMAT] [--help] [--project=PROJECT_ID] \
    [--quiet, -q][--verbosity=VERBOSITY; default="warning"] [--version, -v] \
    [-h] [--log-http][--trace-token=TRACE_TOKEN] [--no-user-output-enabled]
```

For the sake of accurate classification, the `infuse` tool's syntax
distinguishes between a _command_ and a _command group_. In docs, however,
command-line contents are generally referred to as commands.

You can use commands (and groups) alone or with one or more flags. A _flag_ is a
INF Use–specific term for any element other than the command or group name
itself. A command or flag might also take an _argument_, for example, a region
value.

Example command:

```
infuse init
```

Example command with a flag:

```
infuse init --skip-diagnostics
```

Example command with multiple elements:

```
infuse ml-engine jobs submit training
${JOB_NAME} \\
    \--package-path trainer \\
    \--module-name trainer.task \\
    \--staging-bucket gs://${BUCKET}
\\ --job-dir gs://${BUCKET}/${JOB_NAME} \\ --runtime-version 1.2 \\ --region
us-central1 \\ --config config/config.yaml \\ -- \\ --data_dir
gs://${BUCKET}/data \\
    \--output_dir gs://${BUCKET}/\${JOB_NAME} \\
\--train_steps 10000
```

Where:

- `ml-engine` is a `infuse` command group.
- `jobs` is an `ml-engine` command group.
- `submit` is a `jobs` command group.
- `training` is a `submit` command.
- `${JOB_NAME}` is an argument that refers to a variable called `JOB_NAME` that
  was set earlier.
- `--package-path` is a flag.

In addition to the term flag, _option_ is often used as a catchall term when you
don't want to mire the reader in specialized nomenclature.

## Linux commands

**Caution:** Linux command syntax is notoriously complex. This section covers
only the most common elements. For a more detailed reference, see
[The Linux Command Line](http://wiki.lib.sun.ac.za/images/c/ca/TLCL-13.07.pdf).

Where the `infuse` command-line tool uses the catchall terms flag and option,
Linux commands use _options_, _parameters_, _arguments_, and a host of
specialized syntax elements. Here's an example:

```
find /usr/src/linux -follow -type f -name '\*.\[ch]' | xargs grep -iHn pcnet
```

Where:

- `find` is the command name.
- `/usr/src/linux` is an argument that specifies the path to look in. Easier to
  refer to as just a path.
- `-follow` is an option. The `-` (dash) is part of the option.
- `-type` is an option with a value of `f`.
- `-name` is an option with a value of `'*.[ch]'`, where the asterisk (`*`) is a
  _metacharacter_ signifying a wildcard. Metacharacters are used in Linux shell
  commands for _globbing_, or filename expansion. In addition to the asterisk,
  metacharacters include the question mark (?) and caret (^).

The results of the first command are redirected using a _pipe_ (`|)` to the
`xargs grep -iHn pcnet` command. Other redirection symbols include `>`, `<`,
`>>`, and `<<`. Redirection means capturing output from a file, command,
program, script, or even code block within a script and sending it as input to
another file, command, program, or script.

### Linux signals

Linux signals, or _sigactions_, require vocabulary choices that are generally
discouraged elsewhere in documentation. We recommend using the terms discussed
here _only_ in the context of process control.

| **Signal**   | **Description**                                                                                                                                                                                                                                                                                                  |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SIGKILL`    | Signal sent to _kill_ a specified process, all members of a specified process group, or all processes on the system. `SIGKILL` cannot be caught, blocked, or ignored. Do not substitute _cancel_, _end_, _exit_, _quit_, _stop_, or _terminate_.                                                                 |
| `SIGTERM`    | Signal sent as a request to _terminate_ a process. Although similar to `SIGKILL`, this signal gives the process a chance to clean up any child processes that might be running. Do not substitute _cancel_, _end_, _exit_, _quit_, or _stop_.                                                                    |
| `SIGQUIT`    | Signal sent from a keyboard to _quit_ a process. Some processes can catch, block, or ignore a quit signal. Do not substitute _cancel_, _end_, _exit_, _quit_, or _stop_.                                                                                                                                         |
| `SIGINT`     | Signal sent to _interrupt_ a process immediately. The default action of this signal is to terminate a process gracefully. It can be handled, ignored, or caught. It can be sent from a terminal—for example, when a user presses Control+C. Do not substitute _suspend_, _end_, _exit_, _pause_, or _terminate_. |
| `SIGPAUSE`   | Signal that tells a process to _pause_, or _sleep_, until any signal is delivered that either terminates the process or invokes a signal-catching function. Do not substitute _cancel_ or _interrupt_.                                                                                                           |
| `SIGSUSPEND` | Signal sent to temporarily _suspend_ execution of a process. Used to prevent delivery of a particular signal during the execution of a critical code section. Do not substitute _pause_ or _exit_.                                                                                                               |
| `SIGSTOP`    | Signal sent to _stop_ execution of a process for later continuation (upon receiving a `SIGCONT` signal). `SIGSTOP` cannot be caught, blocked, or ignored. Do not substitute _cancel_, _end_, _exit_, _interrupt_, _quit_, or _terminate_.                                                                        |

---

<small>Portions of this page are reproduced from work created and
[shared by Google](https://developers.google.com/readme/policies/) and used
according to terms described in the
[Creative Commons 4.0 Attribution License](https://creativecommons.org/licenses/by/4.0/).
For more information, refer to the
[original source page](https://developers.google.com/style/command-line-terminology).</small>
