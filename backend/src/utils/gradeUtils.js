// computePeriodGrade
//
// Computes a single period grade (midterm or finals) from the student's
// scores and the course's GradeWeight config.
//
// Formula:
//   examPart          = examScore × (examWeight / 100)
//   classStandingPart = Σ[ score × (componentWeight / 100) ] × (classStandingWeight / 100)
//   periodGrade       = examPart + classStandingPart

export function computePeriodGrade(period, weightConfig) {
  const { examWeight, classStandingWeight, classStandingComponents } = weightConfig;

  const examPart = (period.examScore || 0) * (examWeight / 100);

  let classStandingTotal = 0;
  for (const component of classStandingComponents) {
    const scoreEntry = period.classStandingScores.find(
      (s) => s.name === component.name
    );
    const score = scoreEntry?.score ?? 0;
    classStandingTotal += score * (component.weight / 100);
  }

  const classStandingPart = classStandingTotal * (classStandingWeight / 100);
  const raw = examPart + classStandingPart;

  return Math.max(0, Math.min(100, parseFloat(raw.toFixed(2))));
}

export function computeFinalGrade(midtermGrade, finalsGrade, weightConfig) {
  const midWeight = weightConfig.midtermWeight / 100;
  const finWeight = weightConfig.finalsWeight / 100;

  return parseFloat(
    (midtermGrade * midWeight + finalsGrade * finWeight).toFixed(2)
  );
}

export function toGradePoint(grade) {
  if (grade >= 97) return 1.0;
  if (grade >= 94) return 1.25;
  if (grade >= 91) return 1.5;
  if (grade >= 88) return 1.75;
  if (grade >= 85) return 2.0;
  if (grade >= 82) return 2.25;
  if (grade >= 79) return 2.5;
  if (grade >= 76) return 2.75;
  if (grade >= 75) return 3.0;
  return 5.0;
}

export function deriveRemarks(finalGrade) {
  return finalGrade >= 75 ? "Passed" : "Failed";
}