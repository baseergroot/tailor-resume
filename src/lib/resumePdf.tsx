import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer"
import ResumeSchema from "@/schema/resumeSchema"
import { z } from "zod"

export type Resume = z.infer<typeof ResumeSchema>

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    lineHeight: 1.45,
    fontFamily: "Helvetica",
    color: "#111827",
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica",
    fontWeight: "bold",
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#111827",
    paddingBottom: 2,
    marginTop: 12,
    marginBottom: 8,
  },
  text: {
    fontFamily: "Helvetica",
    fontSize: 10,
  },
  name: {
    fontFamily: "Helvetica",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  headline: {
    fontFamily: "Helvetica",
    fontSize: 11,
    color: "#374151",
    textAlign: "center",
    marginTop: 10,
  },
  contact: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#4B5563",
    textAlign: "center",
    marginTop: 6,
  },
  bold: {
    fontFamily: "Helvetica",
    fontWeight: "bold",
    fontSize: 11,
  },
  company: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#374151",
    marginBottom: 3,
  },
  bullet: {
    fontFamily: "Helvetica",
    fontSize: 10,
    marginTop: 2,
  },
  meta: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#4B5563",
    marginTop: 3,
  },
  entry: {
    marginBottom: 9,
  },
})

export function ResumePdf({ resume }: { resume: Resume }) {
  return (
    <Document title="Tailored Resume" author="Tailor Resume">
      <Page size="LETTER" style={styles.page}>
        {resume.personalInfo?.name && (
          <View>
            <Text style={styles.name}>{resume.personalInfo.name}</Text>
            {resume.personalInfo.headline && (
              <Text style={styles.headline}>{resume.personalInfo.headline}</Text>
            )}
            {(() => {
              const contactParts = [
                resume.personalInfo?.email,
                resume.personalInfo?.phone,
                resume.personalInfo?.location,
                resume.personalInfo?.linkedin,
                resume.personalInfo?.website,
              ].filter(Boolean)
              return contactParts.length > 0 ? (
                <Text style={styles.contact}>{contactParts.join(" | ")}</Text>
              ) : null
            })()}
          </View>
        )}

        {resume.summary && (
          <View>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.text}>{resume.summary}</Text>
          </View>
        )}

        {resume.skills.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Technical Skills</Text>
            <Text style={styles.text}>{resume.skills.join(" | ")}</Text>
          </View>
        )}

        {resume.experience.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Experience</Text>
            {resume.experience.map((exp, i) => (
              <View key={i} style={styles.entry}>
                <Text style={styles.bold}>{exp.role}</Text>
                {exp.company && (
                  <Text style={styles.company}>
                    {exp.company}
                    {exp.duration ? ` - ${exp.duration}` : ""}
                  </Text>
                )}
                {exp.responsibilities.map((responsibility, j) => (
                  <Text key={j} style={styles.bullet}>
                    {"\u2022 "}
                    {responsibility}
                  </Text>
                ))}
                {exp.technologies.length > 0 && (
                  <Text style={styles.meta}>Technologies: {exp.technologies.join(", ")}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {resume.projects.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Projects</Text>
            {resume.projects.map((project, i) => (
              <View key={i} style={styles.entry}>
                <Text style={styles.bold}>{project.name}</Text>
                <Text style={styles.text}>{project.description}</Text>
                {project.technologies.length > 0 && (
                  <Text style={styles.meta}>Technologies: {project.technologies.join(", ")}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {resume.education.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Education</Text>
            {resume.education.map((edu, i) => {
              const field =
                edu.field &&
                !edu.degree?.toLocaleLowerCase().includes(edu.field.toLocaleLowerCase())
                  ? edu.field
                  : undefined
              const parts = [edu.degree, field].filter(Boolean).join(" in ")
              return (
                <View key={i} style={styles.entry}>
                  <Text style={styles.bold}>{edu.institution}</Text>
                  {parts && <Text style={styles.text}>{parts}</Text>}
                </View>
              )
            })}
          </View>
        )}
      </Page>
    </Document>
  )
}

export async function renderResumePdf(resume: Resume): Promise<Uint8Array<ArrayBuffer>> {
  const buffer = await renderToBuffer(<ResumePdf resume={resume} />)
  return new Uint8Array(buffer)
}