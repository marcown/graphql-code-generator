import {
  DeclarationBlock,
  DeclarationBlockConfig,
  indent,
  isStringValueNode,
} from '@graphql-codegen/visitor-plugin-common';
import { StringValueNode } from 'graphql';

export function transformPythonComment(comment: string | StringValueNode, indentLevel = 0): string {
  if (!comment || comment === '') {
    return '';
  }

  if (isStringValueNode(comment)) {
    comment = comment.value;
  }

  comment = comment.split('*/').join('*\\/');
  let lines = comment.split('\n');
  if (lines.length === 1) {
    return indent(`# ${lines[0]}\n`, indentLevel);
  }
  lines = [`"""`, ...lines, `"""\n`];
  return lines.map(line => indent(line, indentLevel)).join('\n');
}

export class PythonDeclarationBlock extends DeclarationBlock {
  constructor(_config: DeclarationBlockConfig) {
    super({
      enumNameValueSeparator: '=',
      ..._config,
    });
  }

  withComment(comment: string | StringValueNode | null): DeclarationBlock {
    const nonEmptyComment = isStringValueNode(comment) ? !!comment.value : !!comment;

    if (nonEmptyComment) {
      this._comment = transformPythonComment(comment, 0);
    }

    return this;
  }

  public get string(): string {
    let result = '';

    if (this._decorator) {
      result += this._decorator + '\n';
    }

    if (this._kind && this._kind !== 'union') {
      result += 'class ';
    }

    const name = this._name + (this._nameGenerics || '');

    if (name) {
      result += name;
    }

    switch (this._kind) {
      case 'enum':
        result += '(Enum)';
        break;
      case 'union':
        result += ' = Union[';
        break;
      default:
        break;
    }

    if (this._block) {
      if (this._content) {
        result += this._content;
      }

      const blockWrapper = this._ignoreBlockWrapper ? '' : this._config.blockWrapper;

      const before = ':' + blockWrapper;
      let after = blockWrapper;
      if (this._kind !== 'scalar') {
        after += `\n__GQL_CODEGEN_${name}__ = ${name}`;
      }

      const block = [before, this._block, after].filter(val => !!val).join('\n');

      if (this._methodName) {
        result += `${this._methodName}(${this._config.blockTransformer(block)})`;
      } else {
        result += this._config.blockTransformer(block);
      }
    } else if (this._content) {
      result += this._content;
      if (this._kind && this._kind === 'union') {
        result += ']';
      }
      result += `\n__GQL_CODEGEN_${name}__ = ${name}`;
    }

    return (this._comment ? this._comment : '') + result + '\n';
  }
}
