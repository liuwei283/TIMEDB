#json.array! @analyses, :id, :name, :cover_image, :mid, :description, :multiple_mid

json.array! @analyses do |analysis|
    json.name analysis.name
    json.mid analysis.mid
    json.cover_image analysis.cover_image
    json.multiple_mid analysis.multiple_mid
    json.single_demo_id analysis.single_demo_id
    json.multiple_demo_id analysis.multiple_demo_id
    json.single_result_id analysis.single_result_id
    json.multiple_result_id analysis.multiple_result_id
    json.url analysis.url

    json.rendered_doc analysis.rendered_doc
end