import styled from 'styled-components';
import classNames from '../style-common/classNames';

export const Content = styled.div.attrs(props => ({
  className: classNames('stackend-cms', props.className)
}))<{
  editable: boolean;
  className: string;
}>`
  &.stackend-cms-editable {
    .stackend-edit:hover {
      ${props =>
        props.editable && {
          background: '#eaf5d0',
          cursor: 'text',
          //outline: 'dashed 1px #777' /* Using outline here to no add a border to the dimensions*/,
          position: 'relative'
        }};
    }

    /* FIXME: tiny mce styling hack */
    .stackend-rich-content .mce-tinymce {
      box-shadow: 0 0 10px #aaa;

      iframe {
        border: none;
      }

      .mce-top-part {
        background: #eee;
      }

      .mce-btn.mce-first .mce-txt {
        margin-left: 5px;
      }
    }
  }
`;

export default Content;
