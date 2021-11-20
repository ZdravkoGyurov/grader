// teacher can see all submissions for given assignment
// SELECT *
// FROM submission
// WHERE assignment_id=$1 AND assignment_id IN (SELECT id FROM assignment
//                        WHERE course_id IN (SELECT course_id FROM assistant_course
//                                            WHERE assistant_email=$2))

// teacher can see any submission by id
// SELECT *
// FROM submission
// WHERE id=$1 AND assignment_id IN (SELECT id FROM assignment
//                        WHERE course_id IN (SELECT course_id FROM assistant_course
//                                            WHERE assistant_email=$2))

// student can only see his submission by id
// SELECT *
// FROM submission
// WHERE id=$1 AND assignment_id IN (SELECT id FROM assignment
//                        WHERE course_id IN (SELECT course_id FROM user_course
//

// student can only see his submissions for given assignment
// SELECT *
// FROM submission
// WHERE assignment_id=$1 AND assignment_id IN (SELECT id FROM assignment
//                        WHERE course_id IN (SELECT course_id FROM user_course
//                                                         WHERE user_email=$2))
