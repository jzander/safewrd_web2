// import { NowRequest, NowResponse } from '@now/node';
import formidable from 'formidable';
import fs from 'fs';
import axios from 'axios';
import FormstackAPI from 'formstack-web-api-node';



const FORMSTACK_TOKEN = process.env.FORMSTACK_TOKEN;
const FORM_ID = 3661274;

// const formstack = new FormstackAPI(FORMSTACK_TOKEN);


function np(fn) {
  return new Promise((ok, fail) => fn((err, res) => err ? fail(err) : ok(res)));
}

export default async (req, res) => {

  res.setHeader("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS, POST");

  if (req.method === 'OPTIONS') {
    return res.json({ message: 'Success' });
  }

  const form = await getForm(req);

  // TODO: Remove this line; it's only for testing
  // res.json({ message: 'OK' });
  res.json(await postForm(form));
}


/**
 * @typedef {object} Form
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} phone
 * @property {string} email
 * @property {string} file
 */

/**
 * Transforms a form into a Formstack-compatible string for the request body
 * @param {Form} form 
 * @returns {string}
 */
function makeFormstackBody(form) {
  // return {  
  //   field_84912478: `${form.firstName} ${form.lastName}`,
  //   field_84912479: form.phone,
  //   field_84912480: form.email,
  //   field_84912481: form.file,
  // };

  // From here
  // https://developers.formstack.com/docs/form-id-submission-post
  return `field_84912478=${form.firstName} ${form.lastName}&field_84912479=${form.phone}&field_84912480=${form.email}&field_84912481=${form.file}`;
}

/**
 * Posts the form to formstack
 * @param {*} form 
 */
async function postForm(form) {
  // TODO: See if this keeps the image readable
  // return np(cb => formstack.submitForm(FORM_ID, data, cb));

  const { data } = await axios({
    url: `https://www.formstack.com/api/v2/form/${FORM_ID}/submission.json`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${FORMSTACK_TOKEN}`,
      Host: 'www.formstack.com',
      'Content-Type': 'application/json',
    },
    data: makeFormstackBody(form),
  });

  return data;
}


async function getForm(req, format = 'base64') {
  const { fields, files } = await parse(req);
  const data = await np(cb => fs.readFile(files.file.path, format, cb));

  // fs.writeFile(__dirname + '/test.jpg', Buffer.from(data, 'base64'), (err, res) => {
  //   console.log({
  //     err,
  //     res,
  //     length: data.length,
  //     __dirname,
  //   });
  // });

  fields.file = data;
  return fields;
}

async function parse(req) {
  return new Promise((ok, fail) => {
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
      if (err) {
        return fail(err);
      }
      ok({ fields, files });
    });
  });
}