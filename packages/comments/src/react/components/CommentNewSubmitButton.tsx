import { nanoid } from '@udecode/plate';
import {
  createPrimitiveComponent,
  useEditorPlugin,
  useEditorRef,
  usePluginOption,
} from '@udecode/plate/react';

import { getCommentFragment } from '../../lib/queries/getCommentFragment';
import { CommentsPlugin } from '../CommentsPlugin';
import {
  SCOPE_ACTIVE_COMMENT,
  useComment,
} from '../stores/comment/CommentProvider';

export const useCommentNewSubmitButton = () => {
  const editor = useEditorRef();

  const { api, getOptions } = useEditorPlugin(CommentsPlugin);
  const newText = usePluginOption(CommentsPlugin, 'newText');

  const comment = useComment(SCOPE_ACTIVE_COMMENT)!;

  const isReplyComment = !!comment;

  const submitButtonText = isReplyComment ? 'Reply' : 'Comment';

  return {
    props: {
      children: submitButtonText,
      disabled: !newText?.trim().length,
      type: 'submit',
      onClick: () => {
        const { activeCommentId, newValue, onCommentAdd } = getOptions();

        const newComment = api.comment.addComment(
          isReplyComment
            ? {
                id: nanoid(),
                parentId: comment.id,
                value: newValue,
              }
            : {
                id: activeCommentId!,
                initialFragment: getCommentFragment(editor, activeCommentId!),
                value: newValue,
              }
        );

        onCommentAdd?.(newComment);

        api.comment.resetNewCommentValue();
      },
    },
  };
};

export const CommentNewSubmitButton = createPrimitiveComponent('button')({
  propsHook: useCommentNewSubmitButton,
});
