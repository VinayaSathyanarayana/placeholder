WITH l AS (
  SELECT *
  FROM lineage
  WHERE id IN (
    SELECT id
    FROM tokens
    WHERE token = $subject
  )
  AND pid IN (
    SELECT id
    FROM tokens
    WHERE token = $object
  )
)
SELECT
  l.id AS subjectId,
  l.pid AS objectId
FROM l
  JOIN tokens AS t1
    INDEXED BY tokens_cover_idx
    USING (id)
  JOIN tokens AS t2
    INDEXED BY tokens_cover_idx
    ON t2.id = l.pid
WHERE
  t1.token = $subject
AND
  t2.token = $object
AND (
  t1.lang = t2.lang OR
  t1.lang IN ( 'eng', 'und' ) OR
  t2.lang IN ( 'eng', 'und' )
)
-- AND t1.tag NOT IN ( 'colloquial' )
-- AND t2.tag NOT IN ( 'colloquial' )
GROUP BY l.id, l.pid
ORDER BY l.id ASC, l.pid ASC
LIMIT $limit
