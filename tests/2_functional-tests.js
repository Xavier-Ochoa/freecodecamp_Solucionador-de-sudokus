const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  suite("POST /api/solve", function () {
    test("Solve valid puzzle", function (done) {
      chai
        .request(server)
        .post("/api/solve")
        .send({
          puzzle:
            "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.match(res.body.solution, /^[1-9]{81}$/);
          done();
        });
    });

    test("Solve missing puzzle string", function (done) {
      chai
        .request(server)
        .post("/api/solve")
        .send({})
        .end((err, res) => {
          assert.equal(res.body.error, "Required field missing");
          done();
        });
    });

    test("Solve puzzle with invalid characters", function (done) {
      chai
        .request(server)
        .post("/api/solve")
        .send({
          puzzle:
            "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3X.",
        })
        .end((err, res) => {
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });

    test("Solve puzzle with incorrect length", function (done) {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: "1.5..2.84..63.12.7.2..5.....9..1" })
        .end((err, res) => {
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });

    test("Solve impossible puzzle", function (done) {
      const impossible = "115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: impossible })
        .end((err, res) => {
          assert.equal(res.body.error, "Puzzle cannot be solved");
          done();
        });
    });
  });

  suite("POST /api/check", function () {
    const puzzle =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";

    test("Check placement with all fields", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle, coordinate: "A2", value: "3" })
        .end((err, res) => {
          assert.equal(res.body.valid, true);
          done();
        });
    });

    test("Check single conflict", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle, coordinate: "A2", value: "1" })
        .end((err, res) => {
          assert.equal(res.body.valid, false);
          assert.include(res.body.conflict, "row");
          done();
        });
    });

    test("Check multiple conflicts", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle, coordinate: "A2", value: "6" })
        .end((err, res) => {
          assert.equal(res.body.valid, false);
          assert.includeMembers(res.body.conflict, ["column", "region"]);
          done();
        });
    });

    test("Check all conflicts", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle, coordinate: "A2", value: "2" })
        .end((err, res) => {
          assert.equal(res.body.valid, false);
          assert.includeMembers(res.body.conflict, ["row", "column", "region"]);
          done();
        });
    });

    test("Check missing fields", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle, coordinate: "A2" })
        .end((err, res) => {
          assert.equal(res.body.error, "Required field(s) missing");
          done();
        });
    });

    test("Check invalid characters", function (done) {
      const invalidPuzzle = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3X.";
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: invalidPuzzle, coordinate: "A2", value: "3" })
        .end((err, res) => {
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });

    test("Check wrong length", function (done) {
      const shortPuzzle = puzzle.slice(0, 80);
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: shortPuzzle, coordinate: "A2", value: "3" })
        .end((err, res) => {
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });

    test("Check invalid coordinate", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle, coordinate: "J2", value: "3" })
        .end((err, res) => {
          assert.equal(res.body.error, "Invalid coordinate");
          done();
        });
    });

    test("Check invalid value", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle, coordinate: "A2", value: "0" })
        .end((err, res) => {
          assert.equal(res.body.error, "Invalid value");
          done();
        });
    });
  });
});
