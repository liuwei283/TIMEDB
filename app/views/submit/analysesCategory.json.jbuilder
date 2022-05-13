#json.array! @analyses, :id, :name, :cover_image, :mid, :description, :multiple_mid

json.array! @analyses do |analysis|
    json.name analysis.name
    json.mid analysis.mid
    json.cover_image analysis.cover_image
    json.multiple_mid analysis.multiple_mid
    json.rendered_doc analysis.rendered_doc
end