export const LINK_FIELDS = `
  fragment LinkFields on Link {
    id
    description
    url
  }
`;

export const COMMENT_FIELDS = `
  fragment CommentFields on Comment {
    id
    body
    createdAt
  }
`;
