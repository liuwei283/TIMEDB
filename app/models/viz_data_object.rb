class VizDataObject < ApplicationRecord
  mount_uploader :file, KeyedFileUploader
  belongs_to :viz_source_file
  belongs_to :visitor
end
