/* eslint-disable no-undef */
const assert = require('assert');
const http = require('http');

async function fetch(method, path, headers, reqBody) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8080,
      body: reqBody,
      path,
      method,
      headers
    };

    const resBody = [];
    const req = http.request(options, res => {
      res.on('data', chunk => {
        if (method !== 'DELETE' && res.statusCode !== 202) {
          resBody.push(chunk);
        }
      });
      res.on('end', () => {
        if (method !== 'DELETE' && res.statusCode !== 202) {
          const data = Buffer.concat(resBody).toString();
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } else {
          resolve({ status: res.statusCode, location: res.headers.location });
        }
      });
    });
    req.on('error', e => {
      console.log(e);
      reject(e);
    });
    if (reqBody) {
      req.write(JSON.stringify(reqBody));
    }
    req.end();
  });
}

const cookie = '';
const headers = {
  'Content-Type': 'application/json',
  Cookie: cookie
};

describe('API', () => {
  it('delete methods', async () => {
    const newCourse = {
      name: 'coursename1',
      description: 'coursedescrition1',
      githubName: 'coursegithubname1'
    };
    const createResult = await fetch('POST', '/course', headers, newCourse);
    assert.equal(createResult.status, 201, 'create course failed');

    const newAssignment = {
      name: 'assignment1',
      description: 'assignmentdescrition1',
      githubName: 'assignmentgithubname1',
      courseId: createResult.data.id
    };
    const createAssignmentResult = await fetch('POST', '/assignment', headers, newAssignment);
    assert.equal(createAssignmentResult.status, 201, 'create assignment failed');

    const deleteAssignmentResult = await fetch('DELETE', `/assignment/${createAssignmentResult.data.id}`, headers);
    assert.equal(deleteAssignmentResult.status, 204, 'delete assignment failed');

    const updatedUserCourse = {
      userEmail: createResult.data.creatorEmail,
      courseId: createResult.data.id,
      courseRoleName: 'Assistant'
    };
    const updateUserCourseResult = await fetch('PUT', '/userCourse', headers, updatedUserCourse);
    assert.equal(updateUserCourseResult.status, 200, 'update user course failed');

    const deleteUserCourse2 = await fetch(
      'DELETE',
      `/userCourse?userEmail=${createResult.data.creatorEmail}&courseId=${createResult.data.id}`,
      headers
    );
    assert.equal(deleteUserCourse2.status, 204, 'delete user course failed');

    const deleteResult = await fetch('DELETE', `/course/${createResult.data.id}`, headers);
    assert.equal(deleteResult.status, 204, 'delete course failed');
  });
  it('all methods', async () => {
    const newCourse = {
      name: 'coursename1',
      description: 'coursedescrition1',
      githubName: 'coursegithubname1'
    };
    const createResult = await fetch('POST', '/course', headers, newCourse);
    assert.equal(createResult.status, 201, 'create course failed');

    const getAllResult = await fetch('GET', '/course', headers);
    assert.equal(getAllResult.status, 200, 'get all courses failed');

    const getByIdResult = await fetch('GET', `/course/${createResult.data.id}`, headers);
    assert.equal(getByIdResult.status, 200, 'get course by id failed');

    const updatedNameCourse = {
      name: 'courseupdatedname1'
    };
    const updateNameResult = await fetch('PATCH', `/course/${createResult.data.id}`, headers, updatedNameCourse);
    assert.equal(updateNameResult.status, 200, 'update course name failed');

    const updatedDescriptionCourse = {
      description: 'courseupdateddescription1'
    };
    const updateDescriptionResult = await fetch(
      'PATCH',
      `/course/${createResult.data.id}`,
      headers,
      updatedDescriptionCourse
    );
    assert.equal(updateDescriptionResult.status, 200, 'update course description failed');

    const newAssignment = {
      name: 'assignment1',
      description: 'assignmentdescrition1',
      githubName: 'assignmentgithubname1',
      courseId: createResult.data.id
    };
    const createAssignmentResult = await fetch('POST', '/assignment', headers, newAssignment);
    assert.equal(createAssignmentResult.status, 201, 'create assignment failed');

    const getAllAssignmentsResult = await fetch('GET', `/assignment?courseId=${createResult.data.id}`, headers);
    assert.equal(getAllAssignmentsResult.status, 200, 'get all assignments failed');

    const getAssignmentByIdResult = await fetch('GET', `/assignment/${createAssignmentResult.data.id}`, headers);
    assert.equal(getAssignmentByIdResult.status, 200, 'get assignment by id failed');

    const updatedNameAssignment = {
      name: 'assignmentupdatedname1'
    };
    const updateAssignmentNameResult = await fetch(
      'PATCH',
      `/assignment/${createAssignmentResult.data.id}`,
      headers,
      updatedNameAssignment
    );
    assert.equal(updateAssignmentNameResult.status, 200, 'update assignment name failed');

    const updatedDescriptionAssignment = {
      description: 'assignmentupdateddescription1'
    };
    const updateAssignmentDescriptionResult = await fetch(
      'PATCH',
      `/assignment/${createAssignmentResult.data.id}`,
      headers,
      updatedDescriptionAssignment
    );
    assert.equal(updateAssignmentDescriptionResult.status, 200, 'update assignment description failed');

    const newSubmission = {
      assignmentId: createAssignmentResult.data.id
    };
    const createSubmissionResult = await fetch('POST', '/submission', headers, newSubmission);
    assert.equal(createSubmissionResult.status, 202, 'create submission failed');

    const getAllSubmissionsResult = await fetch(
      'GET',
      `/submission?assignmentId=${createAssignmentResult.data.id}`,
      headers
    );
    assert.equal(getAllSubmissionsResult.status, 200, 'get all submissions failed');

    const getSubmissionByIdResult = await fetch('GET', createSubmissionResult.location, headers);
    assert.equal(getSubmissionByIdResult.status, 200, 'get submission by id failed');
  });
});
