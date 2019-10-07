import chai from 'chai';
import chaiHttp from 'chai-http';

import server from '../app';
import { User } from '../models/user';
import { sendMail } from '../helpers/mailer';

import authSpec from './auth.test';

const { expect } = chai;
chai.use(chaiHttp);

describe('Specs', () => {
  authSpec(server, expect, User);
});
