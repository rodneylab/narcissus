import React from 'react';
import type { FC, ReactNode } from 'react';
import Card from '$components/Card';
import {
  authorText,
  commentContainer,
  commentContent,
  commentListItem,
  dateText,
} from '$components/Comments.css';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb.js';
import localizedFormat from 'dayjs/plugin/localizedFormat.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.locale('en-gb');

interface CommentsProps {
  comments: { created_at: string; author: string; text: string }[];
}

const Comments: FC<CommentsProps> = function Comments({ comments }) {
  return (
    <section>
      <h2 id="comments">Visitor Comments</h2>
      <ul>
        {comments.map((element) => {
          const { author, created_at: date, text } = element;
          return (
            <li className={commentListItem} key={date}>
              <Card containerClass={commentContainer} contentClass={commentContent}>
                <h3 className={authorText}>{author}</h3>
                {text}
                <div>
                  <small className={dateText}>{dayjs(date).fromNow()}</small>
                </div>
              </Card>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Comments;
