import express from "express";
import { validateRequest, currentUser, requireAuth } from "@f1blog/common";
import { test } from "../../controllers/messages/test";
// import { newsItemValidation } from '../../../validation/create-newsitem';
// import { newsItemThreadValidation } from '../../../validation/create-newsitem-thread';
// import { newsItemThreadCommentValidation } from '../../../validation/create-newsitem-thread-comment';
// import { createNewsItem } from '../../controllers/newsitems/create-newsitem';
// import { createNewsItemThread } from '../../controllers/newsitems/create-newsitem-thread';
// import { createNewsItemThreadComment } from '../../controllers/newsitems/create-newsitem-thread-comment';
// import { updateNewsItem } from '../../controllers/newsitems/update-newsitem';
// import { fetchAllNewsItems } from '../../controllers/newsitems/fetch-all-newsitems';
// import { fetchNewsItemById } from '../../controllers/newsitems/fetch-newsitem-by-id';
// import { fetchMyNewsItems } from '../../controllers/newsitems/fetch-my-newsitems';
// import { fetchProfileIdNewsItems } from '../../controllers/newsitems/fetch-profileid-newsitems';
// import { deleteNewsItem } from '../../controllers/newsitems/delete-newsitem';
// import { deleteNewsItemThread } from '../../controllers/newsitems/delete-newsitem-thread';
// import { deleteNewsItemThreadComment } from '../../controllers/newsitems/delete-newsitem-thread-comment';
// import { likeNewsItem } from '../../controllers/newsitems/like-newsitem';
// import { likeNewsItemThread } from '../../controllers/newsitems/like-newsitem-thread';
// import { unLikeNewsItemThread } from '../../controllers/newsitems/un-like-newsitem-thread';
// import { dislikeNewsItemThread } from '../../controllers/newsitems/dislike-newsitem-thread';
// import { unDislikeNewsItemThread } from '../../controllers/newsitems/un-dislike-newsitem-thread';
// import { likeNewsItemThreadComment } from '../../controllers/newsitems/like-newsitem-thread-comment';
// import { unLikeNewsItemThreadComment } from '../../controllers/newsitems/un-like-newsitem-thread-comment';
// import { dislikeNewsItemThreadComment } from '../../controllers/newsitems/dislike-newsitem-thread-comment';
// import { unDislikeNewsItemThreadComment } from '../../controllers/newsitems/un-dislike-newsitem-thread-comment';
// import { unLikeNewsItem } from '../../controllers/newsitems/un-like-newsitem';
// import { dislikeNewsItem } from '../../controllers/newsitems/dislike-newsitem';
// import { unDislikeNewsItem } from '../../controllers/newsitems/un-dislike-newsitem';
// import { fetchMySubscribedProfilesNewsItems } from '../../controllers/newsitems/fetch-my-subscribed-profiles-newsitems';
// import { deleteHash } from '../../../middlewares/clear-hash';

const router = express.Router();

// Shortened for /api/v1/newsitems
router.get("/test", test);
// router.get('/my', currentUser, requireAuth, fetchMyNewsItems);
// router.get('/', fetchAllNewsItems);
// router.get('/:id', fetchNewsItemById);
// router.get('/profile/:id', fetchProfileIdNewsItems);
// router.get(
//   '/subscribed-profiles/:id',
//   currentUser,
//   requireAuth,
//   fetchMySubscribedProfilesNewsItems
// );

// router.post(
//   '/',
//   currentUser,
//   requireAuth,
//   newsItemValidation,
//   validateRequest,
//   deleteHash,
//   createNewsItem
// );
// router.post(
//   '/:id/thread',
//   currentUser,
//   requireAuth,
//   newsItemThreadValidation,
//   validateRequest,
//   deleteHash,
//   createNewsItemThread
// );
// router.post(
//   '/:newsitem_id/thread/:thread_id/comment',
//   currentUser,
//   requireAuth,
//   newsItemThreadCommentValidation,
//   validateRequest,
//   deleteHash,
//   createNewsItemThreadComment
// );
// router.post('/like/:id', currentUser, requireAuth, deleteHash, likeNewsItem);
// router.post(
//   '/unlike/:id',
//   currentUser,
//   requireAuth,
//   deleteHash,
//   unLikeNewsItem
// );
// router.post(
//   '/dislike/:id',
//   currentUser,
//   requireAuth,
//   deleteHash,
//   dislikeNewsItem
// );
// router.post(
//   '/undislike/:id',
//   currentUser,
//   requireAuth,
//   deleteHash,
//   unDislikeNewsItem
// );
// router.post(
//   '/:newsitem_id/thread/:thread_id/like',
//   currentUser,
//   requireAuth,
//   deleteHash,
//   likeNewsItemThread
// );
// router.post(
//   '/:newsitem_id/thread/:thread_id/unlike',
//   currentUser,
//   requireAuth,
//   deleteHash,
//   unLikeNewsItemThread
// );
// router.post(
//   '/:newsitem_id/thread/:thread_id/dislike',
//   currentUser,
//   requireAuth,
//   deleteHash,
//   dislikeNewsItemThread
// );
// router.post(
//   '/:newsitem_id/thread/:thread_id/undislike',
//   currentUser,
//   requireAuth,
//   deleteHash,
//   unDislikeNewsItemThread
// );
// router.post(
//   '/:newsitem_id/thread/:thread_id/comment/:comment_id/like',
//   currentUser,
//   requireAuth,
//   deleteHash,
//   likeNewsItemThreadComment
// );
// router.post(
//   '/:newsitem_id/thread/:thread_id/comment/:comment_id/unlike',
//   currentUser,
//   requireAuth,
//   deleteHash,
//   unLikeNewsItemThreadComment
// );
// router.post(
//   '/:newsitem_id/thread/:thread_id/comment/:comment_id/dislike',
//   currentUser,
//   requireAuth,
//   deleteHash,
//   dislikeNewsItemThreadComment
// );
// router.post(
//   '/:newsitem_id/thread/:thread_id/comment/:comment_id/undislike',
//   currentUser,
//   requireAuth,
//   deleteHash,
//   unDislikeNewsItemThreadComment
// );

// router.patch(
//   '/:id',
//   currentUser,
//   requireAuth,
//   newsItemValidation,
//   validateRequest,
//   deleteHash,
//   updateNewsItem
// );

// router.delete('/:id', currentUser, requireAuth, deleteNewsItem);
// router.delete(
//   '/:newsitem_id/thread/:thread_id',
//   currentUser,
//   requireAuth,
//   deleteHash,
//   deleteNewsItemThread
// );
// router.delete(
//   '/:newsitem_id/thread/:thread_id/comment/:comment_id',
//   currentUser,
//   requireAuth,
//   deleteHash,
//   deleteNewsItemThreadComment
// );

export { router as messages };
