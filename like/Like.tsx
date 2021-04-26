import React, { Component, MouseEvent } from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { openModal } from '../modal/modalActions';
import { setLike } from '@stackend/api/like';
import * as blogApi from '@stackend/api/blog';
import * as commentApi from '@stackend/api/comments';
import * as Sc from './Like.style';
import ScQuantity from '../style-common/Quantity.style';
//import { sendEventToGA, getGaObjectName } from '../analytics/analyticsFunctions.js';
//import { getCommentsStateKey } from '@stackend/api/comments/commentAction';
import { isLikedByCurrentUser } from '@stackend/api/like/likeActions';

//import { getReferenceUrl } from '@stackend/api/stackend';
//import { getGAGroupData } from '../group/groupAnalytics';

/**
 * Render a like
 *
 * @since 31 mar 2017
 */
type OwnProps = {
  entry: any /*BlogEntry | Comment | ForumThreadEntry*/; //Could not get type-checking to work for this
  module?: any;
};

type Props = OwnProps & {
  isLoggedIn: boolean;
  numberOfLikes: number;
  likedByCurrentUser: boolean;

  openModal: any;
  //onSendEventToGA: any => any,
  setLike: any;
};

type OwnState = {
  numberOfLikes: number;
  likedByCurrentUser: boolean;
  recentlyChanged: boolean;
};

function mapStateToProps({ currentUser, groupBlogEntries, GroupComments, likes }: any, { entry, module }: any): any {
  /* Pre 1.1.1
  const key =
    typeof module !== 'undefined' && typeof entry.referenceGroupId === 'number'
      ? getCommentsStateKey(module, entry.referenceGroupId) //If this is a comment get the groupKey
      : get(entry, 'blogRef.groupRef.permalink'); //If this is a blogEntry get the groupPermalink
  const blogComments = get(groupBlogEntries, `[${key}].json.likesByCurrentUser`);
  const groupComments = get(GroupComments, `[${key}].json.likesByCurrentUser`, {});
  const likesByCurrentUser = blogComments ? blogComments : groupComments;
   */
  const likedByCurrentUser = isLikedByCurrentUser(likes, entry.obfuscatedReference);
  return {
    isLoggedIn: get(currentUser, 'isLoggedIn', false),
    /*
    likedByCurrentUser: get(
      likesByCurrentUser,
      `[${entry.id}]`,
      get(entry, 'likedByCurrentUser.likedByCurrentUser', false)
    ),
     */
    likedByCurrentUser,
    numberOfLikes: entry.numberOfLikes
  };
}

const mapDispatchToProps = {
  openModal,
  //sendEventToGA
  setLike
};

export class Like extends Component<Props, OwnState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      numberOfLikes: props.numberOfLikes,
      likedByCurrentUser: props?.likedByCurrentUser,
      recentlyChanged: false
    };
  }

  componentDidUpdate(prevProps: Props, prevState: OwnState): void {
    const { likedByCurrentUser, numberOfLikes } = this.props;
    //FIXME: ugly fix to keep state in sync
    // FIXME: Update original redux object with the number of likes? Needs a flat redux structure..
    if (likedByCurrentUser !== prevProps.likedByCurrentUser && likedByCurrentUser !== this.state.likedByCurrentUser) {
      this.setState({ likedByCurrentUser });
    }
    if (numberOfLikes !== prevProps.numberOfLikes && numberOfLikes !== this.state.numberOfLikes) {
      this.setState({ numberOfLikes }, () => {
        // Allows for flashing the like etc
        setTimeout(() => {
          this.setState({ recentlyChanged: false });
        }, 2000);
      });
    }
  }

  /**
   * Like/unlike
   * @param e
   */
  handleClick = (e: MouseEvent): void => {
    (async (): Promise<void> => {
      e.preventDefault();
      const { isLoggedIn, openModal, entry, /*onSendEventToGA,*/ setLike } = this.props;
      const { obfuscatedReference } = entry;
      if (!isLoggedIn) {
        openModal({ modalName: 'loginModal' });
        return;
      }

      const like = !this.state.likedByCurrentUser;

      //GA tracking Google Analytics

      let reference;
      //BlogEntry & BlogEntry-Comment:
      switch (entry.__type) {
        case blogApi.BLOG_ENTRY_CLASS:
          reference = entry;
          break;
        case commentApi.COMMENT_CLASS:
          if (entry?.referenceRef) {
            //this is a like on a comment on a referenceable. //ex: blogEntry
            reference = entry.referenceRef;
            break;
          } else {
            //this is a like on a comment on a non-referenceable. //ex: stackend-comment thread
            reference = entry;
            break;
          }
      }

      //is this working??
      this.setState({ likedByCurrentUser: like });

      const r = await setLike({ obfuscatedReference, like });
      // FIXME: Update original redux object with the number of likes?
      this.setState({ numberOfLikes: r.numberOfLikes });

      if (!reference) {
        console.error("Couldn't track like click, didn't find reference");

        //FIXME: create backup tracking when no blogEntry is available.
      }

      /* FIXME: Re add ga
			const objectType = `${entry.__type.substring(entry.__type.lastIndexOf('.') + 1)}`;
			let eventCategory = '',
				eventLabel = '';
			if (typeof reference.blogRef === 'object' && reference.blogId) {
				const {
					groupName: referenceRefPermalink,
					groupType: relatedToObject,
					groupTypeEnum: parentObjectType
				} = getGAGroupData({ blog: reference.blogRef });

				const referencePermalink = !!reference.permalink ? reference.permalink : '';
				eventCategory = `${getGaObjectName({
					object: entry.__type,
					relatedToObject
				})}_(${objectType}-${parentObjectType})`;
				eventLabel = `${referenceRefPermalink}_${referencePermalink}_(${reference.blogId}-${reference.id})`;
			}
			if (reference.__type === commentApi.COMMENT_CLASS) {
				eventCategory = `${getGaObjectName({
					object: reference.__type,
					relatedToObject: 'commentModule'
				})}_(${objectType}-commentModule)`;
				eventLabel = `${getReferenceUrl(window.location.href)}_${reference.permalink}_(${
					reference.referenceGroupId
				}-${reference.referenceId}-${reference.id})`;
			}

			if (like) {
				onSendEventToGA({
					event_action: 'like',
					event_label: eventLabel,
					event_category: eventCategory
				});
			} else {
				onSendEventToGA({
					event_action: 'unlike',
					event_label: eventLabel,
					event_category: eventCategory
				});
			}
			 */
    })();
  };

  render(): JSX.Element | null {
    const { numberOfLikes, likedByCurrentUser, recentlyChanged } = this.state;

    return (
      <Sc.LikeButton
        liked={likedByCurrentUser}
        onClick={this.handleClick}
        className={recentlyChanged ? 'stackend-like-changed' : ''}>
        <ScQuantity>{numberOfLikes}</ScQuantity>
        <i className="material-icons">{likedByCurrentUser ? 'favorite' : 'favorite_border'}</i>
      </Sc.LikeButton>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Like);
