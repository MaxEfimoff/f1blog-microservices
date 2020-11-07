import express from 'express';
import { validateRequest, currentUser, requireAuth } from '@f1blog/common';
import { test } from '../../controllers/newsitems/demo-test';
import { newsItemValidation } from '../../../validation/create-newsitem';
import { newsItemThreadValidation } from '../../../validation/create-newsitem-thread';
import { createNewsItem } from '../../controllers/newsitems/create-newsitem';
import { createNewsItemThread } from '../../controllers/newsitems/create-newsitem-thread';
import { updateNewsItem } from '../../controllers/newsitems/update-newsitem';
import { fetchAllNewsItems } from '../../controllers/newsitems/fetch-all-newsitems';
import { fetchNewsItemById } from '../../controllers/newsitems/fetch-newsitem-by-id';
import { fetchMyNewsItems } from '../../controllers/newsitems/fetch-my-newsitems';
import { fetchProfileIdNewsItems } from '../../controllers/newsitems/fetch-profileid-newsitems';
import { deleteNewsItem } from '../../controllers/newsitems/delete-newsitem';
import { deleteNewsItemThread } from '../../controllers/newsitems/delete-newsitem-thread';
import { likeNewsItem } from '../../controllers/newsitems/like-newsitem';
import { unLikeNewsItem } from '../../controllers/newsitems/un-like-newsitem';
import { dislikeNewsItem } from '../../controllers/newsitems/dislike-newsitem';
import { unDislikeNewsItem } from '../../controllers/newsitems/un-dislike-newsitem';
import { fetchMySubscribedProfilesNewsItems } from '../../controllers/newsitems/fetch-my-subscribed-profiles-newsitems';

const router = express.Router();

// Shortened for /api/v1/newsitems
router.get('/test', currentUser, requireAuth, test);
router.get('/my', currentUser, requireAuth, fetchMyNewsItems);
router.get('/', fetchAllNewsItems);
router.get('/:id', fetchNewsItemById);
router.get('/profile/:id', fetchProfileIdNewsItems);
router.get(
  '/subscribed-profiles/:id',
  currentUser,
  requireAuth,
  fetchMySubscribedProfilesNewsItems
);

router.post(
  '/',
  currentUser,
  requireAuth,
  newsItemValidation,
  validateRequest,
  createNewsItem
);
router.post(
  '/thread/:id',
  currentUser,
  requireAuth,
  newsItemThreadValidation,
  validateRequest,
  createNewsItemThread
);
router.post('/like/:id', currentUser, requireAuth, likeNewsItem);
router.post('/unlike/:id', currentUser, requireAuth, unLikeNewsItem);
router.post('/dislike/:id', currentUser, requireAuth, dislikeNewsItem);
router.post('/undislike/:id', currentUser, requireAuth, unDislikeNewsItem);

router.patch(
  '/:id',
  currentUser,
  requireAuth,
  newsItemValidation,
  validateRequest,
  updateNewsItem
);

router.delete('/:id', currentUser, requireAuth, deleteNewsItem);
router.delete(
  '/thread/:newsitem_id/:thread_id',
  currentUser,
  requireAuth,
  deleteNewsItemThread
);

export { router as newsitems };
